import { derived, grain, readonly } from '@grainular/grains';
import { AuthSessionResponseSchema, type AuthSessionResponseDto } from '@stuf/contracts/auth';
import * as v from 'valibot';
import { ApiError } from '../../../core/services/api-client/errors';
import { client, requestConfig, resolveResponse, validateResult } from '../../../core/services/api-client';
import { rememberPasskeyUse } from '../services/passkey-preference';

/** Current authenticated session, or null before/after authentication. */
const authenticatedSession = grain<AuthSessionResponseDto | null>(null);

/** Current user derived from the authenticated session. */
const authenticatedUser = derived(authenticatedSession, (session) => session?.user ?? null);

/** Whether the application currently has an authenticated session. */
const isAuthenticated = derived(authenticatedSession, (session) => session !== null);

/**
 * Reads the server-side session using the HttpOnly session cookie.
 *
 * The API client turns non-success responses into ApiError instances and
 * validates successful responses against the shared session contract.
 */
const getSession = (signal?: AbortSignal): Promise<AuthSessionResponseDto> => {
    return client.query(
        requestConfig('/auth/session', { authenticated: true, signal }),
        resolveResponse(validateResult(AuthSessionResponseSchema)),
    );
};

/** Revokes the current server-side session and clears its cookie. */
const logoutRequest = () => {
    return client.query(
        requestConfig('/auth/logout', {
            method: 'POST',
            authenticated: true,
        }),
        resolveResponse(validateResult(v.unknown())),
    );
};

/** Replaces the local session after a successful authentication ceremony. */
const setSession = (session: AuthSessionResponseDto): void => {
    rememberPasskeyUse();
    authenticatedSession.set(session);
};

/** Clears local session state without making a network request. */
const reset = (): void => {
    authenticatedSession.set(null);
};

/**
 * Bootstraps identity from the server.
 *
 * A 401 is an expected unauthenticated result and becomes null state. Other
 * failures are rethrown so the caller can handle an unavailable API or an
 * invalid response separately.
 */
const fetchIdentity = async (signal?: AbortSignal): Promise<AuthSessionResponseDto | null> => {
    try {
        const session = await getSession(signal);
        signal?.throwIfAborted();
        setSession(session);
        return session;
    } catch (cause) {
        signal?.throwIfAborted();
        if (cause instanceof ApiError && cause.statusCode === 401) {
            reset();
            return null;
        }
        throw cause;
    }
};

/**
 * Revokes the server session, then clears the local session snapshot.
 * Local state is only cleared after the server operation succeeds.
 */
const logout = async (): Promise<void> => {
    await logoutRequest();
    reset();
};

export const sessionStore = {
    /** Reactive session state consumed by the application shell and feature UI. */
    state: {
        authenticatedSession: readonly(authenticatedSession),
        authenticatedUser,
        isAuthenticated,
    },
    /** Commands that change or refresh the current session. */
    actions: {
        setSession,
        reset,
        fetchIdentity,
        logout,
    },
};

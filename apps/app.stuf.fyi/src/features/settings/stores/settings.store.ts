import { combined, derived, grain, readonly } from '@grainular/grains';
import { resource } from '@grainular/resource';
import { navigate } from '@grainular/router';
import { UserResponseSchema, type UserResponse } from '@stuf/contracts/user';
import * as v from 'valibot';
import { client, requestConfig, resolveResponse, validateResult } from '../../../core/services/api-client';
import { sessionStore } from '../../auth/stores/session.store';

const profile = sessionStore.state.authenticatedUser;
const passkeys = derived(sessionStore.state.authenticatedSession, (session) => session?.passkeys ?? []);
type ProfileDraft = Pick<UserResponse, 'displayName' | 'profileColor'>;

const profileDraft = grain<{ userId: string; draft: ProfileDraft } | null>(null);
const profileSave = resource(
    async ({ abortSignal }) => {
        const attempt = profileDraft();
        if (!attempt) return;

        const user = await client.query(
            requestConfig('/users/me', {
                method: 'PATCH',
                authenticated: true,
                json: attempt.draft,
                signal: abortSignal,
            }),
            resolveResponse(validateResult(UserResponseSchema)),
        );
        abortSignal.throwIfAborted();
        sessionStore.actions.updateUser(user);
    },
    [profileDraft],
);

const profileSaveStatus = derived(combined([profile, profileDraft, profileSave.state]), ([user, attempt, state]) =>
    user && attempt?.userId === user.id ? state : 'idle',
);

const saveProfile = (userId: string, draft: ProfileDraft): void => {
    if (profile()?.id === userId) profileDraft.set({ userId, draft });
};

const signOutFailed = grain(false);
const deleteAccountFailed = grain(false);

const signOut = async (): Promise<void> => {
    signOutFailed.set(false);
    try {
        await sessionStore.actions.logout();
    } catch {
        signOutFailed.set(true);
        return;
    }

    navigate({ path: '/sign-in', history: 'replace' });
};

const deleteAccount = async (): Promise<void> => {
    deleteAccountFailed.set(false);
    try {
        await client.query(
            requestConfig('/users/me', { method: 'DELETE', authenticated: true }),
            resolveResponse(validateResult(v.undefined())),
        );
    } catch {
        deleteAccountFailed.set(true);
        return;
    }

    sessionStore.actions.reset();
    navigate({ path: '/sign-in', history: 'replace' });
};

const clearDeleteAccountError = () => deleteAccountFailed.set(false);

sessionStore.state.isAuthenticated.subscribe((authenticated) => {
    if (authenticated) return;

    signOutFailed.set(false);
    clearDeleteAccountError();
});

export const settingsStore = {
    state: {
        profile,
        passkeys,
        profileSaveStatus,
        signOutFailed: readonly(signOutFailed),
        deleteAccountFailed: readonly(deleteAccountFailed),
    },
    actions: { saveProfile, signOut, deleteAccount, clearDeleteAccountError },
};

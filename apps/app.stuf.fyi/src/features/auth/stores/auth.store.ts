import {
    browserSupportsWebAuthn,
    startAuthentication,
    startRegistration,
    type AuthenticationResponseJSON,
    type PublicKeyCredentialCreationOptionsJSON,
    type PublicKeyCredentialRequestOptionsJSON,
    type RegistrationResponseJSON,
} from '@simplewebauthn/browser';
import {
    AuthSessionResponseSchema,
    AuthenticationOptionsResponseSchema,
    RegistrationOptionsResponseSchema,
} from '@stuf/contracts/auth';
import type {
    AuthSessionResponseDto,
    AuthenticationOptionsResponseDto,
    RegistrationOptionsResponseDto,
} from '@stuf/contracts/auth';
import { client, requestConfig, resolveResponse, validateResult } from '../../../core/services/api-client';
import { WebAuthnNotSupportedError } from '../../../core/services/api-client/errors';
import { sessionStore } from './session.store';

/** Starts registration by requesting a one-time WebAuthn challenge. */
const getRegistrationOptions = (): Promise<RegistrationOptionsResponseDto> => {
    return client.query(
        requestConfig('/auth/passkeys/register/options', {
            method: 'POST',
            authenticated: true,
        }),
        resolveResponse(validateResult(RegistrationOptionsResponseSchema)),
    );
};

/** Sends the browser-generated registration credential to the API for verification. */
const verifyRegistration = (response: RegistrationResponseJSON): Promise<AuthSessionResponseDto> => {
    return client.query(
        requestConfig('/auth/passkeys/register/verify', {
            method: 'POST',
            authenticated: true,
            json: response,
        }),
        resolveResponse(validateResult(AuthSessionResponseSchema)),
    );
};

/** Starts authentication by requesting a one-time WebAuthn challenge. */
const getAuthenticationOptions = (): Promise<AuthenticationOptionsResponseDto> => {
    return client.query(
        requestConfig('/auth/passkeys/authenticate/options', {
            method: 'POST',
            authenticated: true,
        }),
        resolveResponse(validateResult(AuthenticationOptionsResponseSchema)),
    );
};

/** Sends the browser-generated authentication assertion to the API for verification. */
const verifyAuthentication = (response: AuthenticationResponseJSON): Promise<AuthSessionResponseDto> => {
    return client.query(
        requestConfig('/auth/passkeys/authenticate/verify', {
            method: 'POST',
            authenticated: true,
            json: response,
        }),
        resolveResponse(validateResult(AuthSessionResponseSchema)),
    );
};

/**
 * Runs the complete registration ceremony.
 *
 * The browser performs the credential creation step; only its serialized
 * response is sent to the API. A successful response updates sessionStore.
 */
const register = async (): Promise<AuthSessionResponseDto> => {
    if (!browserSupportsWebAuthn()) {
        throw new WebAuthnNotSupportedError();
    }

    const options = await getRegistrationOptions();
    const credential = await startRegistration({
        optionsJSON: options as PublicKeyCredentialCreationOptionsJSON,
    });
    const session = await verifyRegistration(credential);
    sessionStore.actions.setSession(session);
    return session;
};

/**
 * Runs the complete authentication ceremony.
 *
 * The browser selects and signs with a passkey; the API verifies the
 * assertion and establishes the HttpOnly session cookie.
 */
const authenticate = async (): Promise<AuthSessionResponseDto> => {
    if (!browserSupportsWebAuthn()) {
        throw new WebAuthnNotSupportedError();
    }

    const options = await getAuthenticationOptions();
    const credential = await startAuthentication({
        optionsJSON: options as PublicKeyCredentialRequestOptionsJSON,
    });
    const session = await verifyAuthentication(credential);
    sessionStore.actions.setSession(session);
    return session;
};

export const authStore = {
    /** Passkey ceremony commands; session state is owned by sessionStore. */
    actions: {
        register,
        authenticate,
    },
};

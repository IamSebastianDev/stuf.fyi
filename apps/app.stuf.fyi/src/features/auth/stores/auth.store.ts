import type {
    AuthenticationResponseJSON,
    PublicKeyCredentialCreationOptionsJSON,
    PublicKeyCredentialRequestOptionsJSON,
    RegistrationResponseJSON,
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
    RegistrationEmailRequestDto,
    VerifiedRegistrationRequestDto,
} from '@stuf/contracts/auth';
import * as v from 'valibot';
import { client, requestConfig, resolveResponse, validateResult } from '../../../core/services/api-client';
import { WebAuthnNotSupportedError } from '../../../core/services/api-client/errors';
import { sessionStore } from './session.store';

/** Whether this browser can run a passkey ceremony on the current origin. */
export const supportsPasskeys = (): boolean =>
    globalThis.isSecureContext === true && typeof globalThis.PublicKeyCredential === 'function';

/** Sends a verification link for the email entered during signup. */
const sendRegistrationEmail = (input: RegistrationEmailRequestDto): Promise<void> => {
    return client.query(
        requestConfig('/auth/passkeys/register/email', { method: 'POST', json: input }),
        resolveResponse(validateResult(v.undefined())),
    );
};

/** Exchanges the email proof for a one-time WebAuthn registration challenge. */
const getRegistrationOptions = (input: VerifiedRegistrationRequestDto): Promise<RegistrationOptionsResponseDto> => {
    return client.query(
        requestConfig('/auth/passkeys/register/options', {
            method: 'POST',
            authenticated: true,
            json: input,
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
 * response is sent to the API. A successful response updates the shared session.
 */
const register = async (input: VerifiedRegistrationRequestDto): Promise<AuthSessionResponseDto> => {
    if (!supportsPasskeys()) {
        throw new WebAuthnNotSupportedError();
    }

    const [{ startRegistration }, options] = await Promise.all([
        import('@simplewebauthn/browser'),
        getRegistrationOptions(input),
    ]);
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
    if (!supportsPasskeys()) {
        throw new WebAuthnNotSupportedError();
    }

    const [{ startAuthentication }, options] = await Promise.all([
        import('@simplewebauthn/browser'),
        getAuthenticationOptions(),
    ]);
    const credential = await startAuthentication({
        optionsJSON: options as PublicKeyCredentialRequestOptionsJSON,
    });
    const session = await verifyAuthentication(credential);
    sessionStore.actions.setSession(session);
    return session;
};

export const authStore = {
    actions: { sendRegistrationEmail, register, authenticate },
};

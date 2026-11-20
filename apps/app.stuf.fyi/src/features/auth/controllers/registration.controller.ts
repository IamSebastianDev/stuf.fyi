import { form } from '@grainular/forms';
import { grain, readonly } from '@grainular/grains';
import { navigate } from '@grainular/router';
import { AuthErrorCode, VerifiedRegistrationRequestSchema } from '@stuf/contracts/auth';
import { safeParse } from 'valibot';
import { ApiError } from '../../../core/services/api-client/errors';
import { authStore } from '../stores/auth.store';
import { authErrorKey, isPasskeyPromptCanceled } from './passkey-errors';

const registrationErrors = new Map([
    ['WebAuthnNotSupportedError', 'Open the verification link in a browser that supports passkeys.'],
    [
        AuthErrorCode.RegistrationEmailLinkInvalid,
        'This verification link expired or has already been used. Request a new one.',
    ],
    [
        AuthErrorCode.RegistrationEmailAlreadyUsed,
        'An account already uses this email. Sign in with your existing passkey.',
    ],
    [AuthErrorCode.PasskeyAlreadyRegistered, 'This passkey is already registered. Sign in to use it.'],
]);

/** Sends the signup link to the address entered in the form. */
export const createRegistrationEmailForm = () => {
    const {
        controls: { email },
    } = form({ email: '' });
    const sent = grain(false);
    const error = grain('');

    const submit = async () => {
        error.set('');
        sent.set(false);
        try {
            await authStore.actions.sendRegistrationEmail({ email: email.value() });
            sent.set(true);
        } catch (cause) {
            error.set(
                cause instanceof ApiError && cause.statusCode === 429
                    ? 'Please wait a minute before requesting another link.'
                    : 'Couldn’t send the verification email. Try again.',
            );
        }
    };

    return { email, submit, sent: readonly(sent), error: readonly(error) };
};

/** Creates the passkey after the user opens the email link and confirms. */
export const createVerifiedRegistration = () => {
    const error = grain('');

    const register = async () => {
        const token = new URLSearchParams(window.location.hash.slice(1)).get('token');
        const proof = safeParse(VerifiedRegistrationRequestSchema, { token });
        if (!proof.success) {
            error.set('This verification link is incomplete. Request a new one.');
            return;
        }

        error.set('');
        try {
            await authStore.actions.register(proof.output);
        } catch (cause) {
            const key = authErrorKey(cause);
            if (isPasskeyPromptCanceled(key)) return;
            error.set(registrationErrors.get(key) ?? 'Couldn’t create your passkey. Try again.');
            return;
        }

        navigate({ path: '/settings', history: 'replace' });
    };

    return { register, error: readonly(error) };
};

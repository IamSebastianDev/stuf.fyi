import { grain, readonly } from '@grainular/grains';
import { navigate } from '@grainular/router';
import { AuthErrorCode } from '@stuf/contracts/auth';
import { authStore } from '../stores/auth.store';
import { authErrorKey, isPasskeyPromptCanceled } from './passkey-errors';

const passkeyErrorMessages = new Map([
    ['WebAuthnNotSupportedError', 'Open this app in a browser that supports passkeys to continue.'],
    ['NotSupportedError', 'This passkey prompt is unavailable. Try again.'],
    [AuthErrorCode.PasskeyNotFound, 'This passkey could not sign in. Try another passkey.'],
]);

/** Runs passkey sign-in and exposes browser or API failures to the page. */
export const createPasskeySignIn = () => {
    const error = grain('');

    const submit = async () => {
        error.set('');
        try {
            await authStore.actions.authenticate();
        } catch (cause) {
            const key = authErrorKey(cause);
            if (isPasskeyPromptCanceled(key)) return;
            error.set(passkeyErrorMessages.get(key) ?? 'Couldn’t continue with a passkey. Try again.');
            return;
        }

        navigate({ path: '/settings', history: 'replace' });
    };

    return { signIn: submit, error: readonly(error) };
};

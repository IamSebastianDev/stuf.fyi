import { derived, grain } from '@grainular/grains';
import { attr, html, on } from '@grainular/nord';
import { browserSupportsWebAuthn } from '@simplewebauthn/browser';
import { Button } from '@stuf/bits/button';
import { Icon } from '@stuf/bits/icon';
import { Surface } from '@stuf/bits/surface';
import { Text } from '@stuf/bits/text';
import { Check, KeyRound } from 'lucide';
import { ApiError, WebAuthnNotSupportedError } from '../../core/services/api-client/errors';
import { authStore } from './auth.store';
import { hasUsedPasskey } from './passkey-preference';
import './sign-in.css';

type PasskeyAction = keyof typeof authStore.actions;
type PasskeyPhase = 'idle' | 'pending' | 'verified' | 'error';

const actionLabels: Record<PasskeyAction, string> = {
    authenticate: 'Sign in with a passkey',
    register: 'Create a passkey',
};

const unsupportedMessage = 'Open Stuf in a browser that supports passkeys to continue.';

const passkeyError = (cause: unknown): string => {
    if (cause instanceof WebAuthnNotSupportedError) return unsupportedMessage;
    if (cause instanceof Error && (cause.name === 'NotAllowedError' || cause.name === 'AbortError')) {
        return 'The passkey prompt closed or timed out. Try again when you’re ready.';
    }
    if (cause instanceof ApiError) {
        if (cause.errorCode === 'PASSKEY_NOT_FOUND') return 'This passkey could not sign in. Try another passkey.';
        if (cause.errorCode === 'PASSKEY_ALREADY_REGISTERED')
            return 'This passkey is already registered. Use it to sign in.';
    }
    return 'Couldn’t continue with a passkey. Try again.';
};

export const SignIn = ({ onSignedIn }: { onSignedIn: () => void }) => {
    const supported = window.isSecureContext && browserSupportsWebAuthn();
    const [primary, secondary]: [PasskeyAction, PasskeyAction] = hasUsedPasskey()
        ? ['authenticate', 'register']
        : ['register', 'authenticate'];
    const request = grain<{ phase: PasskeyPhase; message: string }>({ phase: 'idle', message: '' });
    const phase = derived(request, (state) => state.phase);
    const busy = derived(phase, (value) => value === 'pending' || value === 'verified');
    const message = derived(request, (state) => state.message);

    const continueWithPasskey = async (action: PasskeyAction) => {
        if (busy()) return;

        request.set({ phase: 'pending', message: 'Waiting for your passkey…' });
        try {
            await authStore.actions[action]();
            request.set({ phase: 'verified', message: 'Signed in' });
            await new Promise<void>((resolve) => window.setTimeout(resolve, 400));
            onSignedIn();
        } catch (cause) {
            request.set({ phase: 'error', message: passkeyError(cause) });
        }
    };

    return html`
        <main class="app-screen passkey-screen">
            <header class="passkey-intro">
                <span class="passkey-basket" ${Surface()} aria-hidden="true">🧺</span>
                <h1 ${Text({ size: 'heading' })}>Plan dinners, shop together</h1>
                <p ${Text({ appearance: 'muted' })}>
                    Use a passkey with Face ID, Touch ID, your fingerprint, or your device PIN.
                </p>
            </header>
            <div class="passkey-actions">
                ${
                    supported
                        ? html`
                              <button
                                  type="button"
                                  ${Button({ appearance: 'inverse', layout: 'full', size: 'lg', disabled: busy })}
                                  ${on('click', () => void continueWithPasskey(primary))}
                              >
                                  <svg ${Icon({ icon: KeyRound })}></svg>
                                  ${actionLabels[primary]}
                              </button>
                              <button
                                  type="button"
                                  ${Button({ appearance: 'plain', layout: 'full', disabled: busy })}
                                  ${on('click', () => void continueWithPasskey(secondary))}
                              >
                                  ${actionLabels[secondary]}
                              </button>
                              <div class="passkey-feedback" ${attr({ 'data-phase': phase })}>
                                  <div class="passkey-feedback-panel">
                                      <span class="passkey-feedback-icon" aria-hidden="true">
                                          <svg ${Icon({ icon: Check, size: 'md' })}></svg>
                                      </span>
                                      <p ${Text({ appearance: 'muted' })} role="status">${message}</p>
                                  </div>
                              </div>
                              <p ${Text({ size: 'caption', appearance: 'muted' })}>
                                  A synced passkey works on other devices using the same password manager.
                              </p>
                          `
                        : html`<p ${Text({ appearance: 'muted' })}>${unsupportedMessage}</p>`
                }
            </div>
        </main>
    `;
};

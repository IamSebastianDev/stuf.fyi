import { derived, grain } from '@grainular/grains';
import { html, on } from '@grainular/nord';
import { Button } from '@stuf/bits/button';
import { Text } from '@stuf/bits/text';
import { sessionStore } from './session.store';

export const SignedIn = ({ onSignedOut }: { onSignedOut: () => void }) => {
    const state = grain<'idle' | 'pending' | 'error'>('idle');
    const pending = derived(state, (value) => value === 'pending');
    const message = derived(state, (value) => (value === 'error' ? 'Couldn’t sign out. Try again.' : ''));

    const signOut = async () => {
        if (pending()) return;

        state.set('pending');
        try {
            await sessionStore.actions.logout();
            onSignedOut();
        } catch {
            state.set('error');
        }
    };

    return html`
        <main class="app-screen app-status-screen">
            <h1 ${Text({ size: 'heading' })}>You’re signed in</h1>
            <button
                type="button"
                ${Button({ appearance: 'plain', disabled: pending })}
                ${on('click', () => void signOut())}
            >
                Sign out
            </button>
            <p ${Text({ size: 'caption', appearance: 'muted' })} role="status">${message}</p>
        </main>
    `;
};

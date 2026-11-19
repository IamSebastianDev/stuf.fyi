import { $switch, html, on, type Fragment } from '@grainular/nord';
import { resource } from '@grainular/resource';
import { Button } from '@stuf/bits/button';
import { Text } from '@stuf/bits/text';
import { sessionStore } from '../stores/session.store';

const identity = resource(async ({ abortSignal }) => {
    await sessionStore.actions.fetchIdentity(abortSignal);
});

/** Renders the application once session restoration completes. */
export const SessionGate = (content: () => Fragment) => html`
    ${$switch(identity.state)
        .$case('idle', content)
        .$case(
            'error',
            () => html`
                <main class="app-screen app-status-screen">
                    <h1 ${Text({ size: 'heading' })}>Couldn’t check your session</h1>
                    <button type="button" ${Button()} ${on('click', identity.refresh)}>Try again</button>
                </main>
            `,
        )
        .$default(
            () => html`
                <main class="app-screen app-status-screen">
                    <p ${Text({ appearance: 'muted' })} role="status">Checking your session…</p>
                </main>
            `,
        )}
`;

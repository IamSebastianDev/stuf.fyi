import { $switch, html, on } from '@grainular/nord';
import { resource } from '@grainular/resource';
import { Button } from '@stuf/bits/button';
import { Text } from '@stuf/bits/text';
import { AppRoutes } from './app.router';
import { sessionStore } from './features/auth/session.store';

const identity = resource(async ({ abortSignal }) => {
    await sessionStore.actions.fetchIdentity(abortSignal);
});

export const App = () => html`
    ${$switch(identity.state)
        .$case('idle', AppRoutes)
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

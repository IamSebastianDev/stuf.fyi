import { $switch, html, type Fragment } from '@grainular/nord';
import { resource } from '@grainular/resource';
import { SessionStatusScreen } from '@stuf/bits/auth-flow';
import { sessionStore } from './stores/session.store';

const identity = resource(async ({ abortSignal }) => {
    await sessionStore.actions.fetchIdentity(abortSignal);
});

/** Renders the application once session restoration completes. */
export const SessionGate = (content: () => Fragment) => html`
    ${$switch(identity.state)
        .$case('idle', content)
        .$case('error', () => SessionStatusScreen({ state: 'error', retry: identity.refresh }))
        .$default(() => SessionStatusScreen({ state: 'checking' }))}
`;

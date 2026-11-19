import { html } from '@grainular/nord';
import { Text } from '@stuf/bits/text';
import { SignOutButton } from '../features/auth/components/sign-out-button';

export default function HomePage() {
    return html`
        <main class="app-screen app-status-screen">
            <h1 ${Text({ size: 'heading' })}>You’re signed in</h1>
            ${SignOutButton()}
        </main>
    `;
}

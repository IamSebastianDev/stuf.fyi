import { html } from '@grainular/nord';
import { Text } from '@stuf/bits/text';
import { Device } from '../components/device';
import { Passkeys } from '../components/passkeys';
import { Profile } from '../components/profile';
import { createProfileEditor } from '../controllers/profile-editor.controller';
import { settingsStore } from '../stores/settings.store';
import './settings.page.css';

/** Connects the Settings sections to the current account and its actions. */
export default function SettingsPage() {
    const { profile, passkeys, signOutFailed, deleteAccountFailed } = settingsStore.state;
    const { signOut, deleteAccount, clearDeleteAccountError } = settingsStore.actions;
    const user = profile();
    const profileEditor = createProfileEditor(user);

    return html`
        <main class="app-screen settings-page">
            <h1 ${Text({ size: 'heading' })}>Settings</h1>
            ${Passkeys({ passkeys, email: user?.email })} ${Profile(profileEditor)}
            ${Device({ signOut, signOutFailed, deleteAccount, deleteAccountFailed, clearDeleteAccountError })}
        </main>
    `;
}

import { derived } from '@grainular/grains';
import { $each, $if, html } from '@grainular/nord';
import { Icon } from '@stuf/bits/icon';
import { Surface } from '@stuf/bits/surface';
import { Text } from '@stuf/bits/text';
import { KeyRound } from 'lucide';
import { SignOutButton } from '../../auth/components/sign-out-button';
import { sessionStore } from '../../auth/stores/session.store';
import './settings.page.css';

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

export default function SettingsPage() {
    const passkeys = derived(sessionStore.state.authenticatedSession, (session) => session?.passkeys ?? []);
    const hasPasskeys = derived(passkeys, (items) => items.length > 0);

    return html`
        <main class="app-screen settings-page">
            <h1 ${Text({ size: 'heading' })}>Settings</h1>
            <section aria-labelledby="settings-sign-in">
                <h2 id="settings-sign-in" ${Text({ size: 'section-label', appearance: 'muted' })}>Sign-in</h2>
                ${$if(hasPasskeys)
                    .$then(
                        () => html`
                            <ul class="settings-passkeys" role="list" ${Surface()}>
                                ${$each(passkeys)
                                    .$withKey(({ id }) => id)
                                    .$as(
                                        ({ name, createdAt }) => html`
                                            <li>
                                                <span class="settings-passkey-icon" aria-hidden="true">
                                                    <svg ${Icon({ icon: KeyRound, size: 'sm' })}></svg>
                                                </span>
                                                <div>
                                                    <p ${Text({ size: 'label' })}>${name || 'Passkey'}</p>
                                                    <p ${Text({ size: 'caption', appearance: 'muted' })}>
                                                        Added
                                                        <time datetime="${createdAt}"
                                                            >${dateFormat.format(new Date(createdAt))}</time
                                                        >
                                                    </p>
                                                </div>
                                            </li>
                                        `,
                                    )}
                            </ul>
                        `,
                    )
                    .$else(
                        () =>
                            html`<p class="settings-empty" ${Surface()} ${Text({ appearance: 'muted' })}>
                                No registered passkeys.
                            </p>`,
                    )}
            </section>
            <section aria-labelledby="settings-device">
                <h2 id="settings-device" ${Text({ size: 'section-label', appearance: 'muted' })}>Device</h2>
                <div class="settings-device" ${Surface()}>${SignOutButton()}</div>
            </section>
        </main>
    `;
}

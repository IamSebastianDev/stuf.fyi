import { $each, html, type Subscribable } from '@grainular/nord';
import { Icon } from '@stuf/bits/icon';
import { Surface } from '@stuf/bits/surface';
import { Text } from '@stuf/bits/text';
import type { PasskeyResponse } from '@stuf/contracts/auth';
import { KeyRound } from 'lucide';
import './passkeys.css';

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

const PasskeyRow = ({ name, createdAt }: PasskeyResponse) => html`
    <li>
        <span class="settings-passkey-icon" aria-hidden="true">
            <svg ${Icon({ icon: KeyRound, size: 'sm' })}></svg>
        </span>
        <div>
            <p ${Text({ size: 'label' })}>${name || 'Passkey'}</p>
            <p ${Text({ size: 'caption', appearance: 'muted' })}>
                Added
                <time datetime="${createdAt}">${dateFormat.format(new Date(createdAt))}</time>
            </p>
        </div>
    </li>
`;

type PasskeysProps = {
    passkeys: Subscribable<PasskeyResponse[]>;
    email?: string | null;
};

/** Displays the account's registered passkeys in the Sign-in section. */
export const Passkeys = ({ passkeys, email }: PasskeysProps) => html`
    <section aria-labelledby="settings-sign-in">
        <h2 id="settings-sign-in" ${Text({ size: 'section-label', appearance: 'muted' })}>Sign-in</h2>
        ${email && html`<p ${Text({ appearance: 'muted' })}>${email}</p>`}
        <ul class="settings-passkeys" role="list" ${Surface()}>
            ${$each(passkeys)
                .$withKey(({ id }) => id)
                .$as(PasskeyRow)
                .$empty(
                    () => html`
                        <li class="settings-empty" ${Text({ appearance: 'muted' })}>No registered passkeys.</li>
                    `,
                )}
        </ul>
    </section>
`;

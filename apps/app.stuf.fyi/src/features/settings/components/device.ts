import { $if, html, on, type Subscribable } from '@grainular/nord';
import { Button } from '@stuf/bits/button';
import { Surface } from '@stuf/bits/surface';
import { Text } from '@stuf/bits/text';
import { DeleteAccount } from './delete-account';
import './device.css';

type DeviceProps = {
    signOut: () => Promise<void>;
    signOutFailed: Subscribable<boolean>;
    deleteAccount: () => Promise<void>;
    deleteAccountFailed: Subscribable<boolean>;
    clearDeleteAccountError: () => void;
};

/** Shows session and account actions with feedback for each operation. */
export const Device = ({
    signOut,
    signOutFailed,
    deleteAccount,
    deleteAccountFailed,
    clearDeleteAccountError,
}: DeviceProps) => html`
    <section class="settings-device-section" aria-labelledby="settings-device">
        <h2 id="settings-device" ${Text({ size: 'section-label', appearance: 'muted' })}>Device</h2>
        <div class="settings-device" ${Surface()}>
            <button type="button" ${Button({ appearance: 'plain' })} ${on('click', signOut)}>Sign out</button>
            <p ${Text({ size: 'caption', appearance: 'muted' })} role="status">
                ${$if(signOutFailed).$then(() => html`Couldn’t sign out. Try again.`)}
            </p>
            ${DeleteAccount({
                failed: deleteAccountFailed,
                confirm: deleteAccount,
                clearError: clearDeleteAccountError,
            })}
        </div>
    </section>
`;

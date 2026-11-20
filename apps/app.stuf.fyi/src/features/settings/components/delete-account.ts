import { $if, html, on, type Subscribable } from '@grainular/nord';
import { Button } from '@stuf/bits/button';
import { Sheet } from '@stuf/bits/sheet';
import { Text } from '@stuf/bits/text';
import './delete-account.css';

const sheetId = 'settings-delete-account';

type DeleteAccountProps = {
    failed: Subscribable<boolean>;
    confirm: () => Promise<void>;
    clearError: () => void;
};

const DeleteAccountConfirmation = ({ failed, confirm }: Pick<DeleteAccountProps, 'failed' | 'confirm'>) => html`
    <div class="settings-delete-confirmation">
        <p ${Text()}>
            This permanently deletes your Stuf account, your registered passkeys, and every list you own. Other members
            will lose access to any shared lists you own.
        </p>
        <p ${Text({ size: 'caption', appearance: 'muted' })}>This can’t be undone.</p>
        ${$if(failed).$then(
            () => html` <p ${Text({ size: 'caption' })} role="alert">Couldn’t delete your account. Try again.</p> `,
        )}
        <div class="settings-delete-actions">
            <button
                type="button"
                command="request-close"
                commandfor="${sheetId}"
                autofocus
                ${Button({ appearance: 'secondary' })}
            >
                Cancel
            </button>
            <button type="button" ${Button({ appearance: 'destructive' })} ${on('click', confirm)}>
                Delete account
            </button>
        </div>
    </div>
`;

/** Opens the confirmation sheet and clears its error when dismissed. */
export const DeleteAccount = ({ failed, confirm, clearError }: DeleteAccountProps) => html`
    <button
        type="button"
        command="show-modal"
        commandfor="${sheetId}"
        aria-haspopup="dialog"
        ${Button({ appearance: 'destructive' })}
    >
        Delete account
    </button>
    ${Sheet({
        id: sheetId,
        title: 'Delete account',
        onClose: clearError,
        children: DeleteAccountConfirmation({ failed, confirm }),
    })}
`;

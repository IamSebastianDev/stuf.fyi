import { attr, createRef, html, on, ref, type Fragment, type Ref } from '@grainular/nord';
import { X } from 'lucide';
import { Button } from '../button/button';
import { createTransition, fade, slideY } from '../directives/transition/transition.directive';
import { Icon } from '../icon/icon';
import { unwrap, type Prop } from '../shared/prop';
import { Text } from '../text/text';
import { sheetDuration } from './sheet-motion';
import './sheet.css';
import { sheetDrag } from './sheet.directive';

/** Options for a native modal sheet anchored to the bottom of the screen. */
export type SheetProps = {
    /** Dialog ID targeted by the button that opens the sheet. */
    id: string;
    /** Visible heading and accessible name of the sheet. */
    title: string;
    /** Temporarily disables dismissal while an action finishes. */
    dismissDisabled?: Prop<boolean>;
    /** Runs after the native dialog has closed. */
    onClose?: () => void;
    /** Content below the sheet heading. */
    children: Fragment;
};

const sheetController = (element: Ref<HTMLDialogElement>, { dismissDisabled }: SheetProps) => {
    const canDismiss = () => {
        const closing = element.current?.hasAttribute('stuf-sheet-closing');
        return !unwrap(dismissDisabled) && !closing;
    };

    return {
        dragSheet: sheetDrag(canDismiss),
        canDismiss,
    };
};

/** Renders a native dialog with dismissal from the close button, handle, or backdrop. */
export const Sheet = (props: SheetProps) => {
    // Setup the sheet and controls
    const { id, title, dismissDisabled, onClose, children } = props;
    const dialog = createRef<HTMLDialogElement>();
    const { transition, trigger } = createTransition();
    const sheet = sheetController(dialog, props);

    const dismiss = async (event: Event) => {
        event.preventDefault();
        if (!sheet.canDismiss()) return;

        dialog.current?.setAttribute('stuf-sheet-closing', '');
        const completed = await trigger.out();
        if (completed) dialog.current?.close();
        dialog.current?.removeAttribute('stuf-sheet-closing');
    };

    return html`
        <dialog
            stuf-sheet
            ${ref(dialog)}
            ${sheet.dragSheet}
            ${attr({ id, 'aria-label': title })}
            ${on('beforetoggle', (event) => {
                if (event.newState === 'open') void trigger.in();
            })}
            ${on('cancel', dismiss)}
            ${on('close', () => onClose?.())}
        >
            <div stuf-sheet-backdrop aria-hidden="true" ${transition(fade, { duration: sheetDuration })}></div>
            <div stuf-sheet-content ${transition(slideY, { distance: '100%', duration: sheetDuration })}>
                <div stuf-sheet-handle aria-hidden="true"></div>
                <header stuf-sheet-header>
                    <h2 ${Text({ size: 'subheading' })}>${title}</h2>
                    <button
                        type="button"
                        command="request-close"
                        ${attr({ commandfor: id })}
                        ${Button({
                            appearance: 'plain',
                            layout: 'icon',
                            size: 'sm',
                            disabled: dismissDisabled,
                            ariaLabel: 'Close',
                        })}
                    >
                        <svg ${Icon({ icon: X })}></svg>
                    </button>
                </header>
                ${children}
            </div>
        </dialog>
    `;
};

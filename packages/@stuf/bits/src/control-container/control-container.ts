import { $controlErrors, type Control } from '@grainular/forms';
import { combined, derived } from '@grainular/grains';
import { html, type Fragment, type Subscribable } from '@grainular/nord';
import { Text } from '../text/text';
import './control-container.css';

/** Shared props passed to the field rendered by a control container. */
export type ControlChildProps<T> = {
    /** Form control that owns the value and state. */
    control: Control<T>;
    /** ID used to associate a visible label with the field. */
    id?: string;
    /** Field name used in form data. */
    name?: string;
    /** Accessible name when the field has no visible label. */
    ariaLabel?: string;
    /** IDs of the field's help text and visible validation feedback. */
    ariaDescribedBy?: string | Subscribable<string | null>;
    /** Whether the field is currently presented as invalid. */
    ariaInvalid?: boolean | Subscribable<boolean>;
};

/** Options for labeling and describing a single form control. */
export type ControlContainerProps<T> = {
    /** Form control whose validation feedback is displayed. */
    control: Control<T>;
    /** Visible label associated with the field. */
    label: string;
    /** Field name used in form data. */
    name?: string;
    /** Optional instructions associated with the field. */
    description?: string;
    /** Renders a field component with the shared control and accessibility props. */
    children: (props: ControlChildProps<T>) => Fragment;
};

/** Renders the shared label, help, and errors for a single form control. */
export const ControlContainer = <T>({ control, label, name, description, children }: ControlContainerProps<T>) => {
    const { id, touched, isValid } = control;
    const descriptionId = `${id}-description`;
    const errorsId = `${id}-errors`;
    const ariaInvalid = derived(combined([touched, isValid]), ([wasTouched, valid]) => wasTouched && !valid);
    const ariaDescribedBy = derived(
        ariaInvalid,
        (showError) => [description && descriptionId, showError && errorsId].filter(Boolean).join(' ') || null,
    );
    return html`
        <div stuf-control-container>
            <label for="${id}" ${Text({ size: 'label' })}>${label}</label>
            ${children({ control, id, name, ariaDescribedBy, ariaInvalid })}
            ${
                description &&
                html`<p id="${descriptionId}" ${Text({ size: 'caption', appearance: 'muted' })}>${description}</p>`
            }
            <div id="${errorsId}" stuf-control-errors aria-live="polite">
                ${$controlErrors(control, (message) => html`<p ${Text({ size: 'caption' })}>${message}</p>`)}
            </div>
        </div>
    `;
};

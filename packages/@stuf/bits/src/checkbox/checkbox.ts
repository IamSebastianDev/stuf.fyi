import { attr, html } from '@grainular/nord';
import { Check } from 'lucide';
import type { ControlChildProps } from '../control-container/control-container';
import { Icon } from '../icon/icon';
import './checkbox.css';

/** Options for binding and labeling a boolean form control. */
export type CheckboxProps = ControlChildProps<boolean> & {
    /** Renders a circle by default or a standalone checkmark when checked. */
    appearance?: 'default' | 'checkmark';
    /** Requires a checked value when using native form validation. */
    required?: boolean;
};

/** Renders a native checkbox. The control owns its checked and disabled states. */
export const Checkbox = ({
    control,
    id,
    name,
    ariaLabel,
    ariaDescribedBy,
    ariaInvalid,
    appearance,
    required,
}: CheckboxProps) => html`
    <span stuf-checkbox ${attr({ appearance })}>
        <input
            type="checkbox"
            ${attr({
                id,
                name,
                'aria-label': ariaLabel,
                'aria-describedby': ariaDescribedBy,
                'aria-invalid': ariaInvalid,
                required,
            })}
            ${control.bind()}
        />
        <svg ${Icon({ icon: Check, size: 'sm' })} stroke-width="3"></svg>
    </span>
`;

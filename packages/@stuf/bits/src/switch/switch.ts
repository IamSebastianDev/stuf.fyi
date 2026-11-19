import { attr, html } from '@grainular/nord';
import type { ControlChildProps } from '../control-container/control-container';
import './switch.css';

/** Options for binding and labeling a boolean setting. */
export type SwitchProps = ControlChildProps<boolean>;

/** Renders a native checkbox with switch semantics and binds it to the supplied control. */
export const Switch = ({ control, id, name, ariaLabel, ariaDescribedBy, ariaInvalid }: SwitchProps) => html`
    <span stuf-switch>
        <input
            type="checkbox"
            role="switch"
            ${attr({
                id,
                name,
                'aria-label': ariaLabel,
                'aria-describedby': ariaDescribedBy,
                'aria-invalid': ariaInvalid,
            })}
            ${control.bind()}
        />
        <span aria-hidden="true"></span>
    </span>
`;

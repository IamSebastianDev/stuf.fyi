import { attr, html } from '@grainular/nord';
import type { ControlChildProps } from '../control-container/control-container';
import { Icon, type IconOptions } from '../icon/icon';
import './text-field.css';

/** Input options for a string control in a ControlContainer or an inline layout. */
export type TextFieldProps = ControlChildProps<string> & {
    /** Outlined or plain styling. Defaults to outlined. */
    appearance?: 'default' | 'plain';
    /** Use end to align a value opposite its label in a settings row. */
    align?: 'start' | 'end';
    /** Optional decorative Lucide icon on the leading side. */
    icon?: IconOptions['icon'];
    /** Native input type. Defaults to text. */
    type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
    /** Example text shown while the input is empty. */
    placeholder?: string;
    /** Native autocomplete hint. */
    autocomplete?: HTMLInputElement['autocomplete'];
    /** Native keyboard capitalization hint. */
    autocapitalize?: HTMLInputElement['autocapitalize'];
    /** Native keyboard hint, such as numeric for a digit-only code. */
    inputMode?: HTMLInputElement['inputMode'];
    /** Maximum number of characters the field accepts. */
    maxLength?: number;
    /** Marks the native input required. Set the validation rule on the form. */
    required?: boolean;
};

/** Renders the styled input and applies the binding and attributes supplied to the field. */
export const TextField = ({
    control,
    id,
    name,
    ariaLabel,
    ariaDescribedBy,
    ariaInvalid,
    appearance = 'default',
    align,
    icon,
    type = 'text',
    placeholder,
    autocomplete,
    autocapitalize,
    inputMode,
    maxLength,
    required,
}: TextFieldProps) => html`
    <span stuf-text-field ${attr({ appearance, align })}>
        ${icon && html`<svg ${Icon({ icon })}></svg>`}
        <input
            type="${type}"
            ${attr({
                id,
                name,
                'aria-label': ariaLabel,
                'aria-describedby': ariaDescribedBy,
                'aria-invalid': ariaInvalid,
                placeholder,
                autocomplete,
                autocapitalize,
                inputmode: inputMode,
                maxlength: maxLength,
                required,
            })}
            ${control.bind()}
        />
    </span>
`;

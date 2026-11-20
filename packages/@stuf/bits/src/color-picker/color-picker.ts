import type { Control } from '@grainular/forms';
import { attr, html } from '@grainular/nord';
import { Avatar, type AvatarOptions } from '../avatar/avatar';
import './color-picker.css';

/** A named swatch backed by the shared avatar palette. */
export type ColorPickerOption<T extends string> = {
    value: T;
    label: string;
    color: NonNullable<AvatarOptions['color']>;
};

/** Options for a single-select color control. */
export type ColorPickerProps<T extends string> = {
    control: Control<T>;
    label: string;
    options: readonly ColorPickerOption<T>[];
};

/** Binds a group of native radio buttons to one form control. */
export const ColorPicker = <T extends string>({ control, label, options }: ColorPickerProps<T>) => html`
    <div stuf-color-picker role="radiogroup" ${attr({ 'aria-label': label })}>
        ${options.map(
            ({ value, label, color }) => html`
                <label>
                    <input type="radio" ${attr({ name: control.id, value, 'aria-label': label })} ${control.bind()} />
                    <span ${Avatar({ color, size: 'sm' })} aria-hidden="true"></span>
                </label>
            `,
        )}
    </div>
`;

import { attr, type Subscribable } from '@grainular/nord';
import './button.css';

/** Options for native buttons and links styled with Stuf. */
export type ButtonOptions = {
    /** Visual emphasis. Defaults to primary. */
    appearance?: 'primary' | 'secondary' | 'inverse' | 'plain' | 'destructive';
    /** Controls width. Inline is the default, full fills the container, and icon reserves a square tap target. */
    layout?: 'inline' | 'full' | 'icon';
    /** Rounds an icon button, such as the Add meal action. */
    shape?: 'default' | 'round';
    /** Minimum height and label size. Defaults to md. */
    size?: 'sm' | 'md' | 'lg';
    /** Prevents activation on a native button. Accepts a boolean or a reactive boolean. */
    disabled?: boolean | Subscribable<boolean>;
    /** Accessible name for a button or link without a visible label. */
    ariaLabel?: string;
};

/** Applies the styling hook and supplied options as attributes on the host element. */
export const Button = ({ appearance, layout, shape, size, disabled, ariaLabel }: ButtonOptions = {}) =>
    attr({
        'stuf-button': '',
        ...(appearance !== undefined && { appearance }),
        ...(layout !== undefined && { layout }),
        ...(shape !== undefined && { shape }),
        ...(size !== undefined && { size }),
        ...(disabled !== undefined && { disabled }),
        ...(ariaLabel !== undefined && { 'aria-label': ariaLabel }),
    });

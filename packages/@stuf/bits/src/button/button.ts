import { attr } from '@grainular/nord';
import './button.css';

/** Styling options for native buttons and links. */
export type ButtonOptions = {
    /** Visual emphasis. Defaults to secondary. */
    appearance?: 'primary' | 'secondary' | 'plain' | 'destructive';
    /** Inline by default. Full fills the available width, and icon is sized for an icon-only control. */
    layout?: 'inline' | 'full' | 'icon';
};

/** Applies the same attributes as a literal stuf-button with optional appearance and layout modifiers. */
export const Button = ({ appearance, layout }: ButtonOptions = {}) => attr({ 'stuf-button': '', appearance, layout });

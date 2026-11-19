import { attr } from '@grainular/nord';
import './badge.css';

/** Appearance options for a short label alongside other content. */
export type BadgeOptions = {
    /** Default uses a neutral fill. Accent highlights metadata such as a planned day. */
    appearance?: 'default' | 'accent';
};

/** Applies the badge styling hook and optional appearance to a native span. */
export const Badge = ({ appearance }: BadgeOptions = {}) =>
    attr({ 'stuf-badge': '', ...(appearance !== undefined && { appearance }) });

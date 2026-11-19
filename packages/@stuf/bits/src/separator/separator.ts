import { attr } from '@grainular/nord';
import './separator.css';

/** Visual options for a horizontal divider. */
export type SeparatorOptions = {
    /** Full spans the container. Inset aligns both ends with the grouped row padding. */
    layout?: 'full' | 'inset';
};

/** Applies the divider styling hook and optional layout to a native hr. */
export const Separator = ({ layout }: SeparatorOptions = {}) =>
    attr({ 'stuf-separator': '', ...(layout !== undefined && { layout }) });

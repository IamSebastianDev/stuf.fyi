import { attr } from '@grainular/nord';
import './text.css';

/** Typography options for native headings, paragraphs, and inline text. */
export type TextOptions = {
    /** Selects a type scale step, including its weight and line height. Defaults to body. */
    size?: 'caption' | 'body' | 'label' | 'label-lg' | 'heading' | 'title';
    /** Inherit the surrounding text color or use the theme's muted color. Defaults to default. */
    appearance?: 'default' | 'muted';
};

/** Applies Stuf typography to the supplied element. */
export const Text = ({ size, appearance }: TextOptions = {}) =>
    attr({
        'stuf-text': '',
        ...(size !== undefined && { size }),
        ...(appearance !== undefined && { appearance }),
    });

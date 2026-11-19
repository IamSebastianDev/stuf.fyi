import { attr } from '@grainular/nord';
import './surface.css';

/** Visual options for a content surface. */
export type SurfaceOptions = {
    /** Choose a grouped background or a raised panel with a visible edge. */
    appearance?: 'default' | 'raised';
};

/** Applies the surface styling hook and optional appearance to the host element. */
export const Surface = ({ appearance }: SurfaceOptions = {}) =>
    attr({ 'stuf-surface': '', ...(appearance !== undefined && { appearance }) });

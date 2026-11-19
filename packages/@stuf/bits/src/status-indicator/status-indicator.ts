import { attr, type Subscribable } from '@grainular/nord';
import './status-indicator.css';

/** Visual treatments for secondary status text. */
export type StatusIndicatorAppearance = 'neutral' | 'positive' | 'pending';

/** Options for a status label with an optional dot. */
export type StatusIndicatorOptions = {
    /** Neutral is text only. Positive and pending add a dot. Defaults to neutral. */
    appearance?: StatusIndicatorAppearance | Subscribable<StatusIndicatorAppearance>;
};

/** Styles a span containing visible status text. */
export const StatusIndicator = ({ appearance }: StatusIndicatorOptions = {}) =>
    attr({ 'stuf-status-indicator': '', ...(appearance !== undefined && { appearance }) });

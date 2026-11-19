import { attr } from '@grainular/nord';
import './avatar.css';

/** Visual options for an initials avatar. */
export type AvatarOptions = {
    /** Profile color from the shared palette. Defaults to blue. */
    color?: 'mint' | 'blue' | 'amber' | 'coral' | 'violet';
    /** Small fits list previews. Medium is the default for member rows. */
    size?: 'sm' | 'md';
};

/** Applies avatar styling to a span containing member initials. */
export const Avatar = ({ color, size }: AvatarOptions = {}) =>
    attr({
        'stuf-avatar': '',
        ...(color !== undefined && { color }),
        ...(size !== undefined && { size }),
    });

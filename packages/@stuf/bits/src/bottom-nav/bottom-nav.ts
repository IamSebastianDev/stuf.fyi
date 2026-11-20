import { derived } from '@grainular/grains';
import { attr, html, type Subscribable } from '@grainular/nord';
import { Icon, type IconOptions } from '../icon/icon';
import './bottom-nav.css';

/** A destination in the bottom navigation. */
export type BottomNavItem = {
    /** Leave out the URL when a destination is unavailable. */
    href?: string;
    label: string;
    icon: IconOptions['icon'];
};

/** Links and active route supplied by the app shell. */
export type BottomNavProps = {
    items: readonly BottomNavItem[];
    currentPath: Subscribable<string | null>;
    /** Accessible name for the navigation landmark. Defaults to Main navigation. */
    ariaLabel?: string;
};

/** Renders native links and marks the current destination for assistive technology. */
export const BottomNav = ({ items, currentPath, ariaLabel = 'Main navigation' }: BottomNavProps) => html`
    <nav stuf-bottom-nav ${attr({ 'aria-label': ariaLabel })}>
        ${items.map(
            ({ href, label, icon }) => html`
                <a
                    ${attr({
                        href,
                        role: href === undefined ? 'link' : undefined,
                        'aria-disabled': href === undefined ? 'true' : undefined,
                        'aria-current': derived(currentPath, (path) => (path === href ? 'page' : undefined)),
                    })}
                >
                    <svg ${Icon({ icon })}></svg>
                    <span>${label}</span>
                </a>
            `,
        )}
    </nav>
`;

import { createDirective } from '@grainular/nord';
import { createElement, type IconNode } from 'lucide';
import './icon.css';

/** Options for styling a native SVG with a Lucide icon. */
export type IconOptions = {
    /** An icon definition imported from Lucide. */
    icon: IconNode;
    /** Size of the glyph. Defaults to md. */
    size?: 'sm' | 'md' | 'lg';
};

/** Renders a Lucide icon inside the supplied SVG. Give informative icons a native accessible name. */
export const Icon = ({ icon, size }: IconOptions) =>
    createDirective<SVGSVGElement>((svg) => {
        const glyph = createElement(icon);

        svg.setAttribute('stuf-icon', '');
        if (size !== undefined) svg.setAttribute('size', size);
        for (const { name, value } of glyph.attributes) {
            if (!svg.hasAttribute(name)) svg.setAttribute(name, value);
        }

        const hasAccessibleName = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby');
        if (hasAccessibleName && !svg.hasAttribute('role')) svg.setAttribute('role', 'img');
        if (!hasAccessibleName && !svg.hasAttribute('aria-hidden')) svg.setAttribute('aria-hidden', 'true');

        svg.append(...glyph.childNodes);
    });

import { html } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { ArrowLeft, CircleCheck, Plus, Search } from 'lucide';
import { expect } from 'storybook/test';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { Button } from '../button/button';
import { Icon, type IconOptions } from './icon';

const icons = { ArrowLeft, CircleCheck, Plus, Search };
const sizes = [
    { size: 'sm', label: 'Small', pixels: 16 },
    { size: 'md', label: 'Medium', pixels: 22 },
    { size: 'lg', label: 'Large', pixels: 28 },
] as const;

type IconArgs = Pick<IconOptions, 'size'> & {
    icon: keyof typeof icons;
};

export default {
    title: 'Icon',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Place Icon on a native SVG and pass a named Lucide import. Use small for compact metadata, medium for controls, and large for standalone icons. Icons inherit text color. Give informative icons an accessible name and label icon-only buttons on the button itself.',
            },
        },
    },
    args: { icon: 'Search', size: 'md' },
    argTypes: {
        icon: { control: 'select', options: Object.keys(icons), description: 'The Lucide icon to render.' },
        size: {
            control: 'select',
            options: sizes.map(({ size }) => size),
            description: 'Width and height of the glyph.',
            table: { defaultValue: { summary: 'md' } },
        },
    },
    render: ({ icon, size }) => renderNordStory(() => html`<svg ${Icon({ icon: icons[icon], size })}></svg>`),
} satisfies Meta<IconArgs>;

type Story = StoryObj<IconArgs>;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    ${sizes.map(
                        ({ size, label }) => html`
                            <figure>
                                <figcaption>${label}</figcaption>
                                <svg ${Icon({ icon: Search, size })}></svg>
                            </figure>
                        `,
                    )}
                    <figure>
                        <figcaption>With text</figcaption>
                        <button type="button" ${Button({ appearance: 'primary' })}>
                            <svg ${Icon({ icon: Plus })}></svg>
                            New meal
                        </button>
                    </figure>
                    <figure>
                        <figcaption>Icon-only action</figcaption>
                        <button type="button" ${Button({ layout: 'icon', ariaLabel: 'Back' })}>
                            <svg ${Icon({ icon: ArrowLeft })}></svg>
                        </button>
                    </figure>
                    <figure>
                        <figcaption>Informative icon</figcaption>
                        <svg ${Icon({ icon: CircleCheck })} aria-label="Synced"></svg>
                    </figure>
                </div>
            `,
        ),
    play: async ({ canvas }) => {
        for (const { label, pixels } of sizes) {
            const sample = canvas.getByText(label).closest('figure')?.querySelector('svg');
            await expect(sample).toHaveStyle({ width: `${pixels}px`, height: `${pixels}px` });
        }

        const backIcon = canvas.getByRole('button', { name: 'Back' }).querySelector('svg');
        await expect(backIcon).toHaveAttribute('aria-hidden', 'true');
        await expect(backIcon).toHaveStyle({ width: '22px', height: '22px' });

        const statusIcon = canvas.getByRole('img', { name: 'Synced' });
        await expect(statusIcon).toHaveAttribute('viewBox', '0 0 24 24');
        await expect(statusIcon.querySelector('circle')?.namespaceURI).toBe('http://www.w3.org/2000/svg');
    },
} satisfies Story;

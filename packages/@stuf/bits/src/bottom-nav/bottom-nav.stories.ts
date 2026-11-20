import { grain } from '@grainular/grains';
import { html } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { Circle, CircleDot, Menu, Square } from 'lucide';
import { expect, within } from 'storybook/test';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { BottomNav } from './bottom-nav';

const items = [
    { href: '#plan', label: 'Plan', icon: Square },
    { href: '#meals', label: 'Meals', icon: Circle },
    { href: '#list', label: 'List', icon: Menu },
    { href: '#settings', label: 'Settings', icon: CircleDot },
];

type BottomNavArgs = { ariaLabel: string; currentPath: string };

export default {
    title: 'Components/Bottom Navigation',
    id: 'bottom-nav',
    tags: ['autodocs'],
    args: { ariaLabel: 'Main navigation', currentPath: '#list' },
    argTypes: {
        ariaLabel: { control: 'text', description: 'Accessible name of the navigation landmark.' },
        currentPath: {
            control: 'select',
            options: items.map(({ href }) => href),
            description: 'Path that receives the active style and aria-current.',
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    'Persistent links between app destinations. Supply native link targets and the current route. Leave out a target to show an unavailable destination. The app shell places the navigation below its scrollable content.',
            },
        },
    },
    render: ({ ariaLabel, currentPath }) =>
        renderNordStory(() => BottomNav({ items, currentPath: grain(currentPath), ariaLabel })),
} satisfies Meta<BottomNavArgs>;

type Story = StoryObj<BottomNavArgs>;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    <figure>
                        <figcaption>Plan and Meals unavailable</figcaption>
                        ${BottomNav({
                            items: items.map((item, index) => (index < 2 ? { ...item, href: undefined } : item)),
                            currentPath: grain('#settings'),
                            ariaLabel: 'Navigation with unavailable destinations',
                        })}
                    </figure>
                    <figure>
                        <figcaption>All destinations</figcaption>
                        ${BottomNav({ items, currentPath: grain('#plan'), ariaLabel: 'Full app navigation' })}
                    </figure>
                </div>
            `,
        ),
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('link', { name: 'Settings', current: 'page' })).toHaveAttribute(
            'href',
            '#settings',
        );
        await expect(canvas.getByRole('link', { name: 'Plan', current: 'page' })).toHaveAttribute('href', '#plan');
        const limited = canvas.getByRole('navigation', { name: 'Navigation with unavailable destinations' });
        for (const name of ['Plan', 'Meals']) {
            const link = within(limited).getByRole('link', { name });
            await expect(link).toHaveAttribute('aria-disabled', 'true');
            await expect(link).not.toHaveAttribute('href');
        }
    },
} satisfies Story;

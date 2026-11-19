import { html } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { Badge, type BadgeOptions } from './badge';

type BadgeArgs = BadgeOptions & { label: string };

export default {
    title: 'Primitives/Badge',
    id: 'badge',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Use a badge for short metadata alongside other content. The default appearance fits labels such as Owner. Use accent to draw attention to a planned day.',
            },
        },
    },
    args: { appearance: 'default', label: 'Owner' },
    argTypes: {
        appearance: {
            control: 'select',
            options: ['default', 'accent'],
            description: 'Neutral or accent styling.',
            table: { defaultValue: { summary: 'default' } },
        },
        label: { control: 'text', description: 'Text inside the badge.' },
    },
    render: ({ appearance, label }) => renderNordStory(() => html`<span ${Badge({ appearance })}>${label}</span>`),
} satisfies Meta<BadgeArgs>;

type Story = StoryObj<BadgeArgs>;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    <figure>
                        <figcaption>Default</figcaption>
                        Alex <span ${Badge()}>Owner</span>
                    </figure>
                    <figure>
                        <figcaption>Accent</figcaption>
                        Chickpea bowls <span ${Badge({ appearance: 'accent' })}>Thu</span>
                    </figure>
                </div>
            `,
        ),
} satisfies Story;

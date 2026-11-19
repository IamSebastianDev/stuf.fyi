import { html } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { StatusIndicator, type StatusIndicatorAppearance } from './status-indicator';

type StatusIndicatorArgs = { appearance: StatusIndicatorAppearance; label: string };

export default {
    title: 'Status Indicator',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Use a visible label for sync or presence. Positive marks a synced list or an active member. Pending marks sync in progress. Neutral shows secondary text such as when someone was last active. Add role="status" when updates should be announced.',
            },
        },
    },
    args: { appearance: 'positive', label: 'Synced' },
    argTypes: {
        appearance: {
            control: 'select',
            options: ['neutral', 'positive', 'pending'],
            description: 'Sets the treatment of the status dot.',
            table: { defaultValue: { summary: 'neutral' } },
        },
        label: { control: 'text', description: 'Visible status text.' },
    },
    render: ({ appearance, label }) =>
        renderNordStory(() => html`<span ${StatusIndicator({ appearance })}>${label}</span>`),
} satisfies Meta<StatusIndicatorArgs>;

type Story = StoryObj<StatusIndicatorArgs>;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    <figure>
                        <figcaption>Positive</figcaption>
                        <span ${StatusIndicator({ appearance: 'positive' })}>Synced</span>
                    </figure>
                    <figure>
                        <figcaption>Pending</figcaption>
                        <span ${StatusIndicator({ appearance: 'pending' })}>Syncing…</span>
                    </figure>
                    <figure>
                        <figcaption>Neutral</figcaption>
                        <span ${StatusIndicator()}>2 days ago</span>
                    </figure>
                </div>
            `,
        ),
} satisfies Story;

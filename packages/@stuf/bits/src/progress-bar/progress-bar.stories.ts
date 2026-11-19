import { html } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { ProgressBar } from './progress-bar';

type ProgressBarArgs = { value: number; max: number };

const progress = ({ value, max }: ProgressBarArgs) => html`
    <progress ${ProgressBar()} aria-label="Shopping completion" value="${value}" max="${max}"></progress>
`;

export default {
    title: 'Primitives/Progress Bar',
    id: 'progress-bar',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Use a progress bar for completion against a known total. For shopping, set value to the number of checked items and max to the total. Use value 0 and max 1 for an empty list. Give the bar an accessible name.',
            },
        },
    },
    args: { value: 3, max: 8 },
    argTypes: {
        value: { control: { type: 'number', min: 0, step: 1 }, description: 'Number of items checked.' },
        max: { control: { type: 'number', min: 1, step: 1 }, description: 'Total number of items.' },
    },
    render: (args) => renderNordStory(() => progress(args)),
} satisfies Meta<ProgressBarArgs>;

type Story = StoryObj<ProgressBarArgs>;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    <figure>
                        <figcaption>Not started · 0 of 8</figcaption>
                        ${progress({ value: 0, max: 8 })}
                    </figure>
                    <figure>
                        <figcaption>In progress · 3 of 8</figcaption>
                        ${progress({ value: 3, max: 8 })}
                    </figure>
                    <figure>
                        <figcaption>Complete · 8 of 8</figcaption>
                        ${progress({ value: 8, max: 8 })}
                    </figure>
                </div>
            `,
        ),
} satisfies Story;

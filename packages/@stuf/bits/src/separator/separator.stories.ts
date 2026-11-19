import { html } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { Surface } from '../surface/surface';
import { Separator } from './separator';

const listDetails = (dividerClass = '') => html`
    <div class="stuf-separator-story-group" ${Surface()}>
        <p class="stuf-separator-story-row">
            <span>List name</span>
            <span>Home</span>
        </p>
        <hr class="${dividerClass}" ${Separator()} aria-hidden="true" />
        <p class="stuf-separator-story-row">
            <span>Members</span>
            <span>2 people</span>
        </p>
    </div>
`;

export default {
    title: 'Primitives/Separator',
    id: 'separator',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Use a hairline to divide sections or rows. Set inline margins in the surrounding layout when the rule should align with the row content.',
            },
        },
    },
    render: () => renderNordStory(listDetails),
} satisfies Meta;

type Story = StoryObj;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    <figure>
                        <figcaption>Full width</figcaption>
                        ${listDetails()}
                    </figure>
                    <figure>
                        <figcaption>Aligned with row content</figcaption>
                        ${listDetails('stuf-separator-story-inset')}
                    </figure>
                </div>
            `,
        ),
} satisfies Story;

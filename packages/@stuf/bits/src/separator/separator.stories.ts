import { html } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { Surface } from '../surface/surface';
import { Separator, type SeparatorOptions } from './separator';

const layouts = [
    { value: 'full', label: 'Full width' },
    { value: 'inset', label: 'Inset' },
] as const;

const listDetails = (options: SeparatorOptions) => html`
    <div class="stuf-separator-story-group" ${Surface()}>
        <p class="stuf-separator-story-row">
            <span>List name</span>
            <span>Home</span>
        </p>
        <hr ${Separator(options)} aria-hidden="true" />
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
                    'A full-width rule divides sections. An inset rule aligns with the row padding on both sides of a grouped surface.',
            },
        },
    },
    render: (options) => renderNordStory(() => listDetails(options)),
    args: { layout: 'full' },
    argTypes: {
        layout: {
            control: 'select',
            options: layouts.map(({ value }) => value),
            description: 'Controls whether the rule is inset on both sides.',
            table: { defaultValue: { summary: 'full' } },
        },
    },
} satisfies Meta<SeparatorOptions>;

type Story = StoryObj<SeparatorOptions>;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    ${layouts.map(
                        ({ value, label }) => html`
                            <figure>
                                <figcaption>${label}</figcaption>
                                ${listDetails({ layout: value })}
                            </figure>
                        `,
                    )}
                </div>
            `,
        ),
} satisfies Story;

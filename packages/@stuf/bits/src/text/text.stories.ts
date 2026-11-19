import { $tag, html } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { Surface } from '../surface/surface';
import { Text, type TextOptions } from './text';

const elements = ['h1', 'h2', 'h3', 'p', 'span'] as const;
const sizes = [
    { size: 'section-label', label: 'Section label', sample: 'Ingredients' },
    { size: 'caption', label: 'Caption', sample: '3 of 8 items checked' },
    { size: 'body', label: 'Body', sample: 'Ingredients from this week’s plan.' },
    { size: 'label', label: 'Label', sample: 'List name' },
    { size: 'subheading', label: 'Subheading', sample: 'Choose dinner' },
    { size: 'heading', label: 'Heading', sample: 'This week' },
] as const;

type TextArgs = TextOptions & { element: (typeof elements)[number]; content: string };

export default {
    title: 'Primitives/Text',
    id: 'text',
    args: { element: 'p', size: 'body', appearance: 'default', content: 'Ingredients from this week’s plan.' },
    argTypes: {
        element: { control: 'select', options: elements, description: 'Native HTML element used in this example.' },
        size: {
            control: 'select',
            options: sizes.map(({ size }) => size),
            description: 'Sets font size, weight, and line height.',
            table: { defaultValue: { summary: 'body' } },
        },
        appearance: {
            control: 'select',
            options: ['default', 'muted'],
            description: 'Inherit the surrounding text color or use the theme’s muted text color.',
            table: { defaultValue: { summary: 'default' } },
        },
        content: { control: 'text', description: 'Visible text inside the element.' },
    },
    render: ({ element, size, appearance, content }) =>
        renderNordStory(() => html`${$tag({ as: element, use: [Text({ size, appearance })], children: content })}`),
} satisfies Meta<TextArgs>;

type Story = StoryObj<TextArgs>;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    ${sizes.map(
                        ({ size, label, sample }) => html`
                            <figure>
                                <figcaption>${label}</figcaption>
                                <p ${Text({ size })}>${sample}</p>
                            </figure>
                        `,
                    )}
                    <figure>
                        <figcaption>Body · Muted</figcaption>
                        <p ${Text({ appearance: 'muted' })}>Ingredients from this week’s plan.</p>
                    </figure>
                </div>
            `,
        ),
} satisfies Story;

export const InContext = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <section class="stuf-text-story-example" ${Surface()}>
                    <h2 ${Text({ size: 'heading' })}>Shopping list</h2>
                    <p ${Text({ size: 'caption', appearance: 'muted' })}>3 of 8 items checked</p>
                    <section>
                        <h3 ${Text({ size: 'section-label', appearance: 'muted' })}>In the cart</h3>
                        <p ${Text()}>Tomatoes, lemons, and chickpeas.</p>
                    </section>
                </section>
            `,
        ),
} satisfies Story;

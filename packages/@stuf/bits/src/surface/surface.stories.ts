import { html } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { Surface, type SurfaceOptions } from './surface';

const appearances = [
    { value: 'default', label: 'Default' },
    { value: 'raised', label: 'Raised' },
] as const;

const mealCard = (options: SurfaceOptions) => html`
    <article class="stuf-surface-story-card" ${Surface(options)}>
        <h3>Chickpea bowls with lemon yogurt</h3>
        <p>Thursday dinner</p>
    </article>
`;

export default {
    title: 'Primitives/Surface',
    id: 'surface',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Group content with a shared background and rounded corners. Use the default Surface for cards and grouped rows. Use raised for a panel that needs to stand out.',
            },
        },
    },
    render: (options) => renderNordStory(() => mealCard(options)),
    args: { appearance: 'default' },
    argTypes: {
        appearance: {
            control: 'select',
            options: appearances.map(({ value }) => value),
            description: 'Sets the background and edge treatment.',
            table: { defaultValue: { summary: 'default' } },
        },
    },
} satisfies Meta<SurfaceOptions>;

type Story = StoryObj<SurfaceOptions>;

export const Playground = {
    parameters: { layout: 'centered' },
} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    ${appearances.map(
                        ({ value, label }) => html`
                            <figure>
                                <figcaption>${label}</figcaption>
                                ${mealCard({ appearance: value })}
                            </figure>
                        `,
                    )}
                </div>
            `,
        ),
} satisfies Story;

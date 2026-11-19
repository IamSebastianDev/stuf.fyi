import { html } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { Surface } from './surface';

const mealCard = () => html`
    <article class="stuf-surface-story-card" ${Surface()}>
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
                    'Group cards and rows with a shared background and rounded corners. Overlays such as the list switcher set their elevation in their own styles.',
            },
        },
    },
    render: () => renderNordStory(mealCard),
} satisfies Meta;

type Story = StoryObj;

export const Playground = {
    parameters: { layout: 'centered' },
} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    <figure>
                        <figcaption>Meal card</figcaption>
                        ${mealCard()}
                    </figure>
                    <figure>
                        <figcaption>List switcher</figcaption>
                        <section class="stuf-surface-story-card stuf-surface-story-list-switcher" ${Surface()}>
                            <h3>Home</h3>
                            <p>8 to get · 3 dinners this week</p>
                        </section>
                    </figure>
                </div>
            `,
        ),
} satisfies Story;

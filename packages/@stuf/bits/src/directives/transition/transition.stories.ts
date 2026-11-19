import { grain } from '@grainular/grains';
import { attr, html, on } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { expect, waitFor, within } from 'storybook/test';
import { renderNordStory } from '../../../.storybook/render-nord-story';
import { Button } from '../../button/button';
import { Text } from '../../text/text';
import { createTransition, fade, slideY, type TransitionDirection } from './transition.directive';

type TransitionArgs = { animateLabel: boolean };

const example = (animateLabel: boolean) => {
    const { transition, trigger } = createTransition();
    const hidden = grain(false);
    const status = grain('Ready');

    const play = async (direction: TransitionDirection) => {
        if (direction === 'in') hidden.set(false);
        status.set('Transitioning…');

        if (await trigger[direction]()) {
            hidden.set(direction === 'out');
            status.set('Complete');
        }
    };

    return html`
        <div class="stuf-transition-story">
            <div>
                <button type="button" ${Button({ appearance: 'secondary' })} ${on('click', () => void play('in'))}>
                    Play in
                </button>
                <button
                    type="button"
                    ${Button({ appearance: 'secondary', disabled: hidden })}
                    ${on('click', () => void play('out'))}
                >
                    Play out
                </button>
            </div>
            <div ${attr({ hidden })} ${transition(fade, { duration: 240 })}>
                ${
                    animateLabel
                        ? html`
                              <p
                                  ${Text()}
                                  ${transition.in(slideY, { distance: '0.5rem', duration: 360 })}
                                  ${transition.out(slideY, { distance: '0.5rem', duration: 420 })}
                              >
                                  Preview
                              </p>
                          `
                        : html`<p ${Text()}>Preview</p>`
                }
            </div>
            <p role="status" ${Text({ size: 'caption', appearance: 'muted' })}>${status}</p>
        </div>
    `;
};

export default {
    title: 'Directives/Transition',
    id: 'transition',
    args: { animateLabel: true },
    argTypes: {
        animateLabel: { control: 'boolean', description: 'Play a separate slide on the preview label.' },
    },
    render: ({ animateLabel }) => renderNordStory(() => example(animateLabel)),
} satisfies Meta<TransitionArgs>;

type Story = StoryObj<TransitionArgs>;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    <figure>
                        <figcaption>Fade</figcaption>
                        ${example(false)}
                    </figure>
                    <figure>
                        <figcaption>Fade and slide</figcaption>
                        ${example(true)}
                    </figure>
                </div>
            `,
        ),
    play: async ({ canvas, userEvent }) => {
        for (const figure of canvas.getAllByRole('figure')) {
            const variant = within(figure);
            const preview = variant.getByText('Preview', { exact: true });
            const status = variant.getByRole('status');

            await userEvent.click(variant.getByRole('button', { name: 'Play out' }));
            await waitFor(() => expect(status).toHaveTextContent('Complete'));
            await expect(preview).not.toBeVisible();

            await userEvent.click(variant.getByRole('button', { name: 'Play in' }));
            await waitFor(() => expect(status).toHaveTextContent('Complete'));
            await expect(preview).toBeVisible();
        }
    },
} satisfies Story;

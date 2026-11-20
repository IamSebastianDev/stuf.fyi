import { control } from '@grainular/forms';
import { html } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { expect, within } from 'storybook/test';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { ColorPicker } from './color-picker';

const options = [
    { value: 'mint', label: 'Mint', color: 'mint' },
    { value: 'blue', label: 'Blue', color: 'blue' },
    { value: 'amber', label: 'Amber', color: 'amber' },
    { value: 'coral', label: 'Coral', color: 'coral' },
    { value: 'violet', label: 'Violet', color: 'violet' },
] as const;

type Args = { label: string; selected: (typeof options)[number]['value']; disabled: boolean };

const example = ({ label, selected, disabled }: Args) => {
    const color = control(selected);
    color.disabled.set(disabled);
    return ColorPicker({ control: color, label, options });
};

export default {
    title: 'Components/Color Picker',
    id: 'color-picker',
    tags: ['autodocs'],
    args: { label: 'Profile color', selected: 'blue', disabled: false },
    argTypes: {
        label: { control: 'text', description: 'Accessible name for the color group.' },
        selected: {
            control: 'select',
            options: options.map(({ value }) => value),
            description: 'Initial value of the bound form control.',
        },
        disabled: { control: 'boolean', description: 'Disables the bound form control.' },
    },
    render: (args) => renderNordStory(() => example(args)),
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: (args) =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    <figure>
                        <figcaption>Profile color</figcaption>
                        ${example(args)}
                    </figure>
                    <figure>
                        <figcaption>Disabled</figcaption>
                        ${example({ ...args, label: 'Disabled color picker', selected: 'coral', disabled: true })}
                    </figure>
                </div>
            `,
        ),
    play: async ({ canvas, userEvent }) => {
        const group = within(canvas.getByRole('radiogroup', { name: 'Profile color' }));
        await expect(group.getByRole('radio', { name: 'Blue' })).toBeChecked();
        await userEvent.click(group.getByRole('radio', { name: 'Mint' }));
        await expect(group.getByRole('radio', { name: 'Mint' })).toBeChecked();
        await userEvent.keyboard('{ArrowRight}');
        await expect(group.getByRole('radio', { name: 'Blue' })).toBeChecked();
        const disabled = within(canvas.getByRole('radiogroup', { name: 'Disabled color picker' }));
        await expect(disabled.getByRole('radio', { name: 'Coral' })).toBeDisabled();
        await expect(disabled.getByRole('radio', { name: 'Coral' })).toBeChecked();
    },
} satisfies Story;

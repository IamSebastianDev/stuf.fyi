import { control } from '@grainular/forms';
import { html } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { ControlContainer } from '@stuf/bits/control-container';
import { Surface } from '@stuf/bits/surface';
import { Switch } from '@stuf/bits/switch';
import { expect } from 'storybook/test';
import { renderNordStory } from '../../.storybook/render-nord-story';

type SwitchArgs = { checked: boolean; disabled: boolean };

const mealsSetting = ({ checked, disabled }: SwitchArgs) => {
    const enabled = control(checked);
    enabled.disabled.set(disabled);

    return html`
        <div class="stuf-switch-story-setting" ${Surface()}>
            ${ControlContainer({
                control: enabled,
                name: 'mealsEnabled',
                label: 'Meals & plan',
                layout: 'label-start',
                children: Switch,
            })}
        </div>
    `;
};

export default {
    title: 'Components/Switch',
    id: 'switch',
    parameters: { docs: { codePanel: false } },
    args: { checked: true, disabled: false },
    argTypes: {
        checked: { control: 'boolean', description: 'Starting value of the setting.' },
        disabled: { control: 'boolean', description: 'Disabled state of the form control.' },
    },
    render: (args) => renderNordStory(() => html`<div class="stuf-form-story-example">${mealsSetting(args)}</div>`),
} satisfies Meta<SwitchArgs>;

type Story = StoryObj<SwitchArgs>;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    <figure>
                        <figcaption>Off</figcaption>
                        ${mealsSetting({ checked: false, disabled: false })}
                    </figure>
                    <figure>
                        <figcaption>On</figcaption>
                        ${mealsSetting({ checked: true, disabled: false })}
                    </figure>
                    <figure>
                        <figcaption>Off and disabled</figcaption>
                        ${mealsSetting({ checked: false, disabled: true })}
                    </figure>
                    <figure>
                        <figcaption>On and disabled</figcaption>
                        ${mealsSetting({ checked: true, disabled: true })}
                    </figure>
                </div>
            `,
        ),
    play: async ({ canvas, userEvent }) => {
        const [off, on, disabledOff, disabledOn] = canvas.getAllByRole('switch', { name: 'Meals & plan' });
        await expect(off).not.toBeChecked();
        await expect(on).toBeChecked();
        await expect(disabledOff).toBeDisabled();
        await expect(disabledOff).not.toBeChecked();
        await expect(disabledOn).toBeDisabled();
        await expect(disabledOn).toBeChecked();

        const offRow = off?.closest('label');
        if (!off || !offRow) throw new Error('The off-state example is missing its labelled row.');
        await userEvent.click(offRow);
        await expect(off).toBeChecked();
        await userEvent.tab();
        await expect(on).toHaveFocus();
        await userEvent.keyboard(' ');
        await expect(on).not.toBeChecked();
        await userEvent.keyboard(' ');
        await userEvent.click(offRow);
        off.blur();
    },
} satisfies Story;

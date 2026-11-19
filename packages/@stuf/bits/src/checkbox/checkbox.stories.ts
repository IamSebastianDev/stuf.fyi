import { control, form, required } from '@grainular/forms';
import { grain } from '@grainular/grains';
import { html, on } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { Button } from '@stuf/bits/button';
import { Checkbox, type CheckboxProps } from '@stuf/bits/checkbox';
import { ControlContainer } from '@stuf/bits/control-container';
import { Text } from '@stuf/bits/text';
import { expect } from 'storybook/test';
import { renderNordStory } from '../../.storybook/render-nord-story';

type CheckboxArgs = Pick<CheckboxProps, 'appearance'> & { checked: boolean; disabled: boolean };

const checkboxRow = ({ label, checked, disabled, appearance }: CheckboxArgs & { label: string }) => {
    const item = control(checked);
    item.disabled.set(disabled);
    const checkmark = appearance === 'checkmark';

    return html`
        <div class="stuf-checkbox-story-row ${checkmark ? '' : 'stuf-checkbox-story-shopping-item'}">
            ${ControlContainer({
                control: item,
                label,
                layout: checkmark ? 'label-start' : 'label-end',
                children: (props) => Checkbox({ ...props, appearance }),
            })}
        </div>
    `;
};

export default {
    title: 'Components/Checkbox',
    id: 'checkbox',
    parameters: { docs: { codePanel: false } },
    args: { checked: false, disabled: false, appearance: 'default' },
    argTypes: {
        appearance: {
            control: 'select',
            options: ['default', 'checkmark'],
            description: 'Show a circle or a standalone checkmark when selected.',
        },
        checked: { control: 'boolean', description: 'Starting value of the form control.' },
        disabled: { control: 'boolean', description: 'Disabled state of the form control.' },
    },
    render: (args) =>
        renderNordStory(
            () => html`<div class="stuf-form-story-example">${checkboxRow({ ...args, label: 'Oat milk' })}</div>`,
        ),
} satisfies Meta<CheckboxArgs>;

type Story = StoryObj<CheckboxArgs>;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    <figure>
                        <figcaption>Unchecked</figcaption>
                        ${checkboxRow({ label: 'Oat milk', checked: false, disabled: false })}
                    </figure>
                    <figure>
                        <figcaption>Checked</figcaption>
                        ${checkboxRow({ label: 'Lemons', checked: true, disabled: false })}
                    </figure>
                    <figure>
                        <figcaption>Disabled</figcaption>
                        ${checkboxRow({ label: 'Olive oil', checked: false, disabled: true })}
                    </figure>
                    <figure>
                        <figcaption>Checked and disabled</figcaption>
                        ${checkboxRow({ label: 'Chickpeas', checked: true, disabled: true })}
                    </figure>
                    <figure>
                        <figcaption>Checkmark</figcaption>
                        ${checkboxRow({ label: 'Supermarket', checked: true, disabled: false, appearance: 'checkmark' })}
                    </figure>
                </div>
            `,
        ),
    play: async ({ canvas, userEvent }) => {
        const milk = canvas.getByRole('checkbox', { name: 'Oat milk' });
        const lemons = canvas.getByRole('checkbox', { name: 'Lemons' });
        const oil = canvas.getByRole('checkbox', { name: 'Olive oil' });
        const chickpeas = canvas.getByRole('checkbox', { name: 'Chickpeas' });

        await expect(milk).not.toBeChecked();
        await expect(lemons).toBeChecked();
        await expect(oil).toBeDisabled();
        await expect(chickpeas).toBeDisabled();
        await expect(chickpeas).toBeChecked();

        await userEvent.click(canvas.getByText('Oat milk'));
        await expect(milk).toBeChecked();
        await userEvent.tab();
        await expect(lemons).toHaveFocus();
        await userEvent.keyboard(' ');
        await expect(lemons).not.toBeChecked();
        await userEvent.keyboard(' ');
        await userEvent.click(canvas.getByText('Oat milk'));
        milk.blur();
    },
} satisfies Story;

export const StoreSelection = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(() => {
            const stores = form({ supermarket: true, market: false });

            return html`
                <div class="stuf-form-story-example">
                    <div class="stuf-checkbox-story-row" role="group" aria-label="Where to buy lemons">
                        ${ControlContainer({
                            control: stores.controls.supermarket,
                            name: 'supermarket',
                            label: 'Supermarket',
                            layout: 'label-start',
                            children: (props) => Checkbox({ ...props, appearance: 'checkmark' }),
                        })}
                        ${ControlContainer({
                            control: stores.controls.market,
                            name: 'market',
                            label: 'Farmers market',
                            layout: 'label-start',
                            children: (props) => Checkbox({ ...props, appearance: 'checkmark' }),
                        })}
                    </div>
                </div>
            `;
        }),
    play: async ({ canvas, userEvent }) => {
        const market = canvas.getByRole('checkbox', { name: 'Farmers market' });
        const mark = market.parentElement?.querySelector('svg');
        await expect(getComputedStyle(market).borderTopColor).toBe('rgba(0, 0, 0, 0)');
        await expect(mark).not.toBeVisible();

        await userEvent.click(canvas.getByText('Farmers market'));
        await expect(market).toBeChecked();
        await expect(getComputedStyle(market).backgroundColor).toBe('rgba(0, 0, 0, 0)');
        await expect(mark).toBeVisible();
        await userEvent.click(canvas.getByText('Farmers market'));
        market.blur();
    },
} satisfies Story;

export const Form = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(() => {
            const list = form({ reviewed: false }, ({ reviewed }) =>
                required(reviewed, { message: 'Confirm that you reviewed the list.' }),
            );
            const result = grain('');

            return html`
                <form
                    class="stuf-form-story-example"
                    novalidate
                    ${on('submit', (event) => {
                        event.preventDefault();
                        result.set('');
                        if (list.validate() && list.value().reviewed) result.set('Review saved.');
                    })}
                >
                    ${ControlContainer({
                        control: list.controls.reviewed,
                        name: 'reviewed',
                        label: 'I reviewed the list',
                        layout: 'label-end',
                        description: 'Check this box to confirm your review.',
                        children: (props) => Checkbox({ ...props, required: true }),
                    })}
                    <div><button type="submit" ${Button()}>Save review</button></div>
                    <p role="status" ${Text({ size: 'caption' })}>${result}</p>
                </form>
            `;
        }),
    play: async ({ canvas, userEvent }) => {
        const checkbox = canvas.getByRole('checkbox', { name: 'I reviewed the list' });
        const save = canvas.getByRole('button', { name: 'Save review' });

        await expect(checkbox).toBeRequired();
        await expect(checkbox).toHaveAttribute('name', 'reviewed');
        await userEvent.click(save);
        await expect(checkbox).toHaveAttribute('aria-invalid', 'true');
        await expect(checkbox).toHaveAccessibleDescription(/Confirm that you reviewed the list\./);

        await userEvent.click(checkbox);
        await expect(checkbox).toHaveAttribute('aria-invalid', 'false');
        await expect(checkbox).toHaveAccessibleDescription('Check this box to confirm your review.');
        await userEvent.click(save);
        await expect(canvas.getByRole('status')).toHaveTextContent('Review saved.');
    },
} satisfies Story;

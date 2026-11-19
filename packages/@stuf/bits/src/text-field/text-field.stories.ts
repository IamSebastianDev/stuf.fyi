import { control } from '@grainular/forms';
import { derived, grain } from '@grainular/grains';
import { $if, html, on } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { Button } from '@stuf/bits/button';
import { Surface } from '@stuf/bits/surface';
import { Text } from '@stuf/bits/text';
import { TextField, type TextFieldProps } from '@stuf/bits/text-field';
import { Plus, Search } from 'lucide';
import { expect } from 'storybook/test';
import { renderNordStory } from '../../.storybook/render-nord-story';

const icons = { none: undefined, plus: Plus, search: Search };

type TextFieldArgs = Pick<
    TextFieldProps,
    'appearance' | 'align' | 'placeholder' | 'type' | 'required' | 'maxLength'
> & {
    icon: keyof typeof icons;
    initialValue: string;
    disabled: boolean;
    invalid: boolean;
};

const exampleField = ({ initialValue, disabled, invalid, icon, ...props }: TextFieldArgs, ariaLabel = 'List name') => {
    const name = control(initialValue);
    name.disabled.set(disabled);

    return TextField({
        ...props,
        control: name,
        icon: icons[icon],
        ariaLabel,
        ariaInvalid: invalid,
    });
};

const addItemRow = () => {
    const item = control('');
    const hasItem = derived(item.value, (value) => value.trim() !== '');
    const result = grain('');

    return html`
        <form
            class="stuf-form-story-example"
            ${on('submit', (event) => {
                event.preventDefault();
                const name = item.value().trim();
                if (!name) return;

                result.set(`Added ${name}`);
                item.reset();
            })}
        >
            <div class="stuf-text-field-story-row">
                ${TextField({
                    control: item,
                    name: 'item',
                    ariaLabel: 'Add item',
                    appearance: 'plain',
                    icon: Plus,
                    placeholder: 'Add item',
                })}
                ${$if(hasItem).$then(() => html`<button type="submit" ${Button({ appearance: 'plain', size: 'sm' })}>Add</button>`)}
            </div>
            <p role="status" ${Text({ size: 'caption' })}>${result}</p>
        </form>
    `;
};

export default {
    title: 'Components/Text Field',
    id: 'text-field',
    parameters: { docs: { codePanel: false } },
    args: {
        appearance: 'default',
        icon: 'none',
        placeholder: 'e.g. Weekend groceries',
        type: 'text',
        required: false,
        initialValue: '',
        disabled: false,
        invalid: false,
    },
    argTypes: {
        appearance: {
            control: 'select',
            options: ['default', 'plain'],
            description: 'Outlined or plain styling.',
        },
        align: { control: 'select', options: ['start', 'end'], description: 'Aligns the value within the field.' },
        icon: { control: 'select', options: Object.keys(icons), description: 'Optional icon on the leading side.' },
        placeholder: { control: 'text', description: 'Example shown when the field is empty.' },
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'search', 'tel', 'url'],
            description: 'Native input type.',
        },
        required: { control: 'boolean', description: 'Marks the input as required.' },
        maxLength: { control: { type: 'number', min: 1 }, description: 'Maximum number of input characters.' },
        initialValue: { control: 'text', description: 'Starting value of the example control.' },
        disabled: { control: 'boolean', description: 'Disabled state of the example control.' },
        invalid: { control: 'boolean', description: 'Shows the invalid input styling.' },
    },
    render: (args) => renderNordStory(() => html`<div class="stuf-form-story-example">${exampleField(args)}</div>`),
} satisfies Meta<TextFieldArgs>;

type Story = StoryObj<TextFieldArgs>;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: (args) =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    <figure>
                        <figcaption>Empty</figcaption>
                        ${exampleField(args)}
                    </figure>
                    <figure>
                        <figcaption>Filled</figcaption>
                        ${exampleField({ ...args, initialValue: 'Weeknight meals' })}
                    </figure>
                    <figure>
                        <figcaption>Invalid</figcaption>
                        ${exampleField({ ...args, invalid: true })}
                    </figure>
                    <figure>
                        <figcaption>Disabled</figcaption>
                        ${exampleField({ ...args, initialValue: 'Shared groceries', disabled: true })}
                    </figure>
                    <figure>
                        <figcaption>Meal search</figcaption>
                        ${exampleField({ ...args, icon: 'search', type: 'search', placeholder: 'Search meals' }, 'Search meals')}
                    </figure>
                    <figure class="stuf-text-field-story-meal-name">
                        <figcaption>Meal title</figcaption>
                        ${TextField({
                            appearance: 'plain',
                            control: control('Chickpea bowls'),
                            placeholder: 'Meal name',
                            ariaLabel: 'Meal name',
                        })}
                    </figure>
                    <figure class="stuf-text-field-story-invite-code">
                        <figcaption>Invite code</figcaption>
                        ${TextField({
                            control: control('K7P4QX'),
                            placeholder: 'Code, e.g. K7P4QX',
                            ariaLabel: 'Invite code',
                            autocapitalize: 'characters',
                            maxLength: 6,
                        })}
                    </figure>
                    <figure>
                        <figcaption>Settings row</figcaption>
                        <div class="stuf-text-field-story-settings-row" ${Surface()}>
                            <label for="text-field-profile-name" ${Text({ size: 'caption', appearance: 'muted' })}
                                >Name</label
                            >
                            ${TextField({
                                control: control(''),
                                id: 'text-field-profile-name',
                                appearance: 'plain',
                                align: 'end',
                                placeholder: 'Optional',
                            })}
                        </div>
                    </figure>
                    <figure>
                        <figcaption>Plain · Add item</figcaption>
                        ${addItemRow()}
                    </figure>
                </div>
            `,
        ),
} satisfies Story;

export const AddItem = {
    name: 'Add item row',
    parameters: { controls: { disable: true }, layout: 'fullscreen' },
    render: () => renderNordStory(() => html`<div class="stuf-text-field-story-list">${addItemRow()}</div>`),
    play: async ({ canvas, userEvent }) => {
        const field = canvas.getByRole('textbox', { name: 'Add item' });
        const icon = field.parentElement?.querySelector('svg');
        await expect(icon).toHaveAttribute('aria-hidden', 'true');
        await expect(field).toHaveAttribute('name', 'item');
        const addButton = () => canvas.queryByRole('button', { name: 'Add' });
        await expect(addButton()).not.toBeInTheDocument();

        await userEvent.type(field, '   ');
        await expect(addButton()).not.toBeInTheDocument();
        await userEvent.clear(field);
        await userEvent.type(field, 'Tomatoes');
        await expect(canvas.getByRole('button', { name: 'Add' })).toBeVisible();
        await userEvent.keyboard('{Enter}');
        await expect(canvas.getByRole('status')).toHaveTextContent('Added Tomatoes');
        await expect(field).toHaveValue('');
        await expect(addButton()).not.toBeInTheDocument();
        await userEvent.tab();
    },
} satisfies Story;

import { html, on } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { KeyRound, Plus } from 'lucide';
import { expect, fn } from 'storybook/test';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { Icon } from '../icon/icon';
import { Button, type ButtonOptions } from './button';

/** Styling options and native attributes exposed as Storybook controls. */
type ButtonArgs = ButtonOptions & {
    children: string;
    disabled: boolean;
    type: HTMLButtonElement['type'];
    ariaLabel: string;
    className: string;
    onClick: (event: MouseEvent) => void;
};

export default {
    title: 'Primitives/Button',
    id: 'button',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Style native buttons and links with Button or the stuf-button attribute. Use a button to perform an action and a link with an href to navigate.',
            },
        },
    },
    render: ({ appearance, layout, shape, size, type, disabled, ariaLabel, className, onClick, children }) =>
        renderNordStory(
            () => html`
                <button
                    type="${type}"
                    class="${className}"
                    ${Button({ appearance, layout, shape, size, disabled, ariaLabel: ariaLabel || undefined })}
                    ${on('click', onClick)}
                >
                    ${children}
                </button>
            `,
        ),
    args: {
        children: 'Save meal',
        layout: 'inline',
        shape: 'default',
        size: 'md',
        disabled: false,
        type: 'button',
        ariaLabel: '',
        className: '',
        onClick: fn(),
    },
    argTypes: {
        children: {
            control: 'text',
            description: 'Visible content of the example button.',
        },
        appearance: {
            control: 'select',
            options: ['primary', 'secondary', 'inverse', 'plain', 'destructive'],
            description: 'Visual emphasis.',
            table: { category: 'Directive options', defaultValue: { summary: 'primary' } },
        },
        layout: {
            control: 'select',
            options: ['inline', 'full', 'icon'],
            description: 'Width behavior for inline, full-width, or icon-only controls.',
            table: { category: 'Directive options', defaultValue: { summary: 'inline' } },
        },
        shape: {
            control: 'select',
            options: ['default', 'round'],
            description: 'Rounds a button in icon layout.',
            table: { category: 'Directive options', defaultValue: { summary: 'default' } },
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Minimum height and label size.',
            table: { category: 'Directive options', defaultValue: { summary: 'md' } },
        },
        disabled: {
            control: 'boolean',
            description: 'Prevents native button activation.',
            table: { category: 'Directive options', defaultValue: { summary: 'false' } },
        },
        type: {
            control: 'select',
            options: ['button', 'submit', 'reset'],
            description: 'Native form button type.',
            table: { type: { summary: "'button' | 'submit' | 'reset'" } },
        },
        ariaLabel: {
            control: 'text',
            description: 'Accessible name for a control without a visible label.',
            table: { category: 'Directive options' },
        },
        className: { control: 'text', description: 'Additional classes supplied by the app.' },
        onClick: {
            control: false,
            description: 'Runs on native click activation. Review events in the Actions panel.',
            table: { type: { summary: '(event: MouseEvent) => void' } },
        },
    },
} satisfies Meta<ButtonArgs>;

type Story = StoryObj<ButtonArgs>;

const appearances = ['primary', 'secondary', 'inverse', 'plain', 'destructive'] as const;
const sizes = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
] as const;

export const Default = {
    name: 'Playground',
    parameters: {
        docs: {
            description: {
                story: 'Use primary for the main action on a screen or in a sheet, such as saving a meal.',
            },
        },
    },
} satisfies Story;

export const Secondary = {
    args: { appearance: 'secondary', children: 'Cancel' },
    parameters: {
        docs: {
            description: {
                story: 'Use secondary for an alternative action alongside the primary one, such as cancelling an edit.',
            },
        },
    },
} satisfies Story;

export const Inverse = {
    args: { appearance: 'inverse', layout: 'full', size: 'lg', children: 'Continue with passkey' },
    parameters: {
        controls: { disable: true },
        docs: { description: { story: 'Use inverse for high-emphasis neutral actions such as passkey sign-in.' } },
    },
    render: ({ appearance, layout, size, children }) =>
        renderNordStory(
            () => html`
                <div class="stuf-form-story-example">
                    <button type="button" ${Button({ appearance, layout, size })}>
                        <svg ${Icon({ icon: KeyRound })}></svg>
                        ${children}
                    </button>
                </div>
            `,
        ),
} satisfies Story;

export const Plain = {
    args: { appearance: 'plain', children: 'Clear filters' },
    parameters: {
        docs: {
            description: {
                story: 'Use plain for low-emphasis actions, such as clearing filters in a toolbar.',
            },
        },
    },
} satisfies Story;

export const Destructive = {
    args: { appearance: 'destructive', children: 'Delete recipe' },
    parameters: {
        docs: {
            description: {
                story: 'Use destructive for actions that delete or remove something. Name what will be removed.',
            },
        },
    },
} satisfies Story;

export const Link = {
    args: { appearance: 'primary', children: 'Go to shopping list' },
    parameters: {
        controls: { include: ['children', 'appearance', 'layout', 'size', 'ariaLabel'] },
        docs: {
            description: {
                story: 'Use an anchor with an href when the control navigates. This link jumps to the shopping list label in the preview.',
            },
            source: {
                language: 'html',
                code: '<a href="#shopping-list" target="_self" stuf-button appearance="primary">Go to shopping list</a>',
            },
        },
    },
    render: ({ appearance, layout, size, ariaLabel, children }) =>
        renderNordStory(
            () => html`
                <a
                    href="#shopping-list"
                    target="_self"
                    ${Button({ appearance, layout, size, ariaLabel: ariaLabel || undefined })}
                >
                    ${children}
                </a>
                <p id="shopping-list" tabindex="-1">Shopping list</p>
            `,
        ),
} satisfies Story;

export const IconOnly = {
    args: { ariaLabel: 'Add meal', onClick: fn() },
    parameters: {
        controls: { disable: true },
        docs: { description: { story: 'Use Icon layout for a standalone icon with an accessible name.' } },
    },
    render: ({ ariaLabel, onClick }) =>
        renderNordStory(
            () => html`
                <button
                    type="button"
                    ${Button({ appearance: 'primary', layout: 'icon', shape: 'round', size: 'sm', ariaLabel })}
                    ${on('click', onClick)}
                >
                    <svg ${Icon({ icon: Plus })}></svg>
                </button>
            `,
        ),
    play: async ({ canvas, userEvent, args }) => {
        const button = canvas.getByRole('button', { name: 'Add meal' });
        await userEvent.tab();
        await expect(button).toHaveFocus();
        await userEvent.keyboard('{Enter}');
        await userEvent.keyboard(' ');
        await expect(args.onClick).toHaveBeenCalledTimes(2);
    },
} satisfies Story;

export const Disabled = {
    args: { disabled: true, children: 'Save meal', onClick: fn() },
    parameters: { controls: { disable: true } },
    play: async ({ canvas, userEvent, args }) => {
        const button = canvas.getByRole('button', { name: 'Save meal' });
        await expect(button).toBeDisabled();
        await userEvent.tab();
        await expect(button).not.toHaveFocus();
        await userEvent.click(button);
        await expect(args.onClick).not.toHaveBeenCalled();
    },
} satisfies Story;

export const Variants = {
    parameters: {
        controls: { disable: true },
        docs: { description: { story: 'Compare all appearances and sizes in their enabled and disabled states.' } },
    },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-button-matrix">
                    ${[false, true].map(
                        (disabled) => html`
                            <section>
                                <h3>${disabled ? 'Disabled' : 'Enabled'}</h3>
                                <dl>
                                    ${appearances.map(
                                        (appearance) => html`
                                            <dt>${appearance}</dt>
                                            <dd>
                                                ${sizes.map(
                                                    ({ value, label }) => html`
                                                        <button
                                                            type="button"
                                                            ${Button({ appearance, size: value, disabled })}
                                                        >
                                                            ${label}
                                                        </button>
                                                    `,
                                                )}
                                            </dd>
                                        `,
                                    )}
                                </dl>
                            </section>
                        `,
                    )}
                </div>
            `,
        ),
} satisfies Story;

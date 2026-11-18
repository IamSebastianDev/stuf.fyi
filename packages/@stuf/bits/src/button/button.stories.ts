import { attr, html, on } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { fn } from 'storybook/test';
import { renderNordStory } from '../../.storybook/render-nord-story';
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
    title: 'Button',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Style native buttons and links with Button or the stuf-button attribute. Use a button to perform an action and a link with an href to navigate.',
            },
        },
    },
    render: ({ appearance, layout, type, disabled, ariaLabel, className, onClick, children }) =>
        renderNordStory(
            () => html`
                <button
                    type="${type}"
                    disabled="${disabled}"
                    class="${className}"
                    ${attr({ 'aria-label': ariaLabel || undefined })}
                    ${Button({ appearance, layout })}
                    ${on('click', onClick)}
                >
                    ${children}
                </button>
            `,
        ),
    args: {
        children: 'Continue with passkey',
        appearance: 'primary',
        layout: 'inline',
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
            options: ['primary', 'secondary', 'plain', 'destructive'],
            description: 'Visual emphasis.',
            table: { category: 'Directive options', defaultValue: { summary: 'secondary' } },
        },
        layout: {
            control: 'select',
            options: ['inline', 'full', 'icon'],
            description: 'Inline, full-width, or icon-only layout.',
            table: { category: 'Directive options', defaultValue: { summary: 'inline' } },
        },
        disabled: {
            control: 'boolean',
            description: 'Prevents native button activation.',
            table: { defaultValue: { summary: 'false' } },
        },
        type: {
            control: 'select',
            options: ['button', 'submit', 'reset'],
            description: 'Native form button type.',
            table: { type: { summary: "'button' | 'submit' | 'reset'" } },
        },
        ariaLabel: { control: 'text', description: 'Accessible name for an icon-only button.' },
        className: { control: 'text', description: 'Additional classes supplied by the app.' },
        onClick: {
            control: false,
            description: 'Runs on native click activation. Review events in the Actions panel.',
            table: { type: { summary: '(event: MouseEvent) => void' } },
        },
    },
} satisfies Meta<ButtonArgs>;

type Story = StoryObj<ButtonArgs>;

export const Default = {} satisfies Story;

export const Primary = {
    args: { appearance: 'primary', children: 'Save meal' },
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
        controls: { include: ['children', 'appearance', 'layout'] },
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
    render: ({ appearance, layout, children }) =>
        renderNordStory(
            () => html`
                <a href="#shopping-list" target="_self" ${Button({ appearance, layout })}>${children}</a>
                <p id="shopping-list" tabindex="-1">Shopping list</p>
            `,
        ),
} satisfies Story;

import { grain } from '@grainular/grains';
import { $if, attr, html, on } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { action } from 'storybook/actions';
import { expect, waitFor } from 'storybook/test';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { Button } from '../button/button';
import { Text } from '../text/text';
import { Sheet } from './sheet';

type SheetArgs = {
    id: string;
    title: string;
    dismissDisabled: boolean;
    onClose: boolean;
    children: string;
};

const defaultArgs: SheetArgs = {
    id: '',
    title: 'New list',
    dismissDisabled: false,
    onClose: true,
    children: 'Use a sheet for a short task that starts from the current screen.',
};

const example = (args: SheetArgs, scrollable = false) => {
    const { title, dismissDisabled, onClose, children } = args;
    const id = args.id || `sheet-${crypto.randomUUID()}`;
    const locked = grain(dismissDisabled);
    return html`
        <button
            type="button"
            command="show-modal"
            ${attr({ commandfor: id })}
            ${Button({ appearance: 'secondary' })}
            ${on('click', () => locked.set(dismissDisabled))}
        >
            ${scrollable ? 'Open scrollable sheet' : 'Open sheet'}
        </button>
        ${Sheet({
            id,
            title,
            dismissDisabled: locked,
            onClose: onClose ? action('onClose') : undefined,
            children: html`
                ${
                    scrollable
                        ? html`<ul>
                              ${Array.from({ length: 24 }, (_, index) => html`<li ${Text()}>List ${index + 1}</li>`)}
                          </ul>`
                        : html`<p ${Text()}>${children}</p>`
                }
                ${$if(locked).$then(
                    () => html`<button
                        type="button"
                        ${Button({ appearance: 'secondary' })}
                        ${on('click', () => locked.set(false))}
                    >
                        Allow dismissal
                    </button>`,
                )}
            `,
        })}
    `;
};

export default {
    title: 'Components/Sheet',
    id: 'sheet',
    tags: ['autodocs'],
    args: defaultArgs,
    argTypes: {
        id: {
            control: 'text',
            description: 'Dialog ID used by the opener. Leave blank to generate an ID for the story.',
        },
        title: { control: 'text', description: 'Heading and accessible name.' },
        dismissDisabled: {
            control: 'boolean',
            description: 'Opens with dismissal blocked. Use Allow dismissal to unlock the Sheet in the story.',
            table: { type: { summary: 'Prop<boolean>' } },
        },
        onClose: {
            control: 'boolean',
            description: 'Enable the close callback and see it fire in the Actions panel.',
            table: { type: { summary: '() => void' } },
        },
        children: {
            control: 'text',
            description: 'Editable text rendered in the Sheet body.',
            table: { type: { summary: 'Fragment' } },
        },
    },
    parameters: {
        docs: {
            description: {
                component:
                    'A bottom-aligned modal for tasks such as creating a list. Use a button with command="show-modal" and commandfor set to the sheet ID. Dismiss with Escape, the close button, a backdrop tap, or a downward swipe from the handle or backdrop.',
            },
        },
    },
    render: (args) => renderNordStory(() => example(args)),
} satisfies Meta<SheetArgs>;

type Story = StoryObj<SheetArgs>;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    <figure>
                        <figcaption>Compact content</figcaption>
                        ${example(defaultArgs)}
                    </figure>
                    <figure>
                        <figcaption>Scrollable content</figcaption>
                        ${example({ ...defaultArgs, title: 'Available lists' }, true)}
                    </figure>
                </div>
            `,
        ),
    play: async ({ canvas, userEvent }) => {
        const trigger = canvas.getByRole('button', { name: 'Open sheet' });
        await userEvent.click(trigger);
        const sheet = canvas.getByRole('dialog', { name: 'New list' });
        await expect(sheet).toBeVisible();
        const strayText = Array.from(sheet.childNodes).filter(
            (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
        );
        await expect(strayText).toHaveLength(0);
        sheet.dispatchEvent(new Event('cancel', { cancelable: true }));
        await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
        await expect(trigger).toHaveFocus();

        const scrollableTrigger = canvas.getByRole('button', { name: 'Open scrollable sheet' });
        await userEvent.click(scrollableTrigger);
        await expect(canvas.getByRole('dialog', { name: 'Available lists' })).toBeVisible();
        await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
        await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
        await expect(scrollableTrigger).toHaveFocus();
    },
} satisfies Story;

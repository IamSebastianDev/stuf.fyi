import { html } from '@grainular/nord';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { Avatar, type AvatarOptions } from './avatar';

const colors = [
    { color: 'mint', label: 'Mint' },
    { color: 'blue', label: 'Blue' },
    { color: 'amber', label: 'Amber' },
    { color: 'coral', label: 'Coral' },
    { color: 'violet', label: 'Violet' },
] as const;

type AvatarArgs = AvatarOptions & { initials: string; name: string };

export default {
    title: 'Avatar',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Use medium avatars in member rows and small avatars in list previews. Supply the initials as text. Hide the avatar from assistive technology alongside a visible name. For a standalone avatar, give the span an image role and label it with the full name.',
            },
        },
    },
    args: { color: 'blue', size: 'md', initials: 'A', name: 'Alex' },
    argTypes: {
        color: {
            control: 'select',
            options: colors.map(({ color }) => color),
            description: 'Color from the profile palette.',
            table: { defaultValue: { summary: 'blue' } },
        },
        size: {
            control: 'select',
            options: ['sm', 'md'],
            description: 'Diameter of the avatar.',
            table: { defaultValue: { summary: 'md' } },
        },
        initials: { control: 'text', description: 'Member initials shown inside the avatar.' },
        name: { control: 'text', description: 'Accessible name of the standalone avatar.' },
    },
    render: ({ color, size, initials, name }) =>
        renderNordStory(
            () => html`<span ${Avatar({ color, size })} role="img" aria-label="${name}">${initials}</span>`,
        ),
} satisfies Meta<AvatarArgs>;

type Story = StoryObj<AvatarArgs>;

export const Playground = {} satisfies Story;

export const Variants = {
    parameters: { controls: { disable: true } },
    render: () =>
        renderNordStory(
            () => html`
                <div class="stuf-story-variants">
                    <figure>
                        <figcaption>Medium · Member row</figcaption>
                        <span ${Avatar()} aria-hidden="true">A</span> Alex
                    </figure>
                    <figure>
                        <figcaption>Small · List switcher</figcaption>
                        <span ${Avatar({ size: 'sm' })} role="img" aria-label="Alex">A</span>
                        <span ${Avatar({ size: 'sm', color: 'coral' })} role="img" aria-label="Lena">L</span>
                    </figure>
                </div>
                <h3>Profile colors</h3>
                <div class="stuf-story-variants">
                    ${colors.map(
                        ({ color, label }) => html`
                            <figure>
                                <figcaption>${label}</figcaption>
                                <span ${Avatar({ color })} aria-hidden="true">A</span>
                            </figure>
                        `,
                    )}
                </div>
            `,
        ),
} satisfies Story;

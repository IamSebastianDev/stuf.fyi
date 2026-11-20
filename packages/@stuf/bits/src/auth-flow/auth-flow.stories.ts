import { form } from '@grainular/forms';
import { grain } from '@grainular/grains';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { expect, fn } from 'storybook/test';
import { renderNordStory } from '../../.storybook/render-nord-story';
import { SessionStatusScreen, SignInScreen, SignUpScreen, VerifyEmailScreen } from './auth-flow';

type SignInArgs = { title: string; mark: string; signIn: () => void };

const signInHref = '#sign-in';
const signUpHref = '#sign-up';

export default {
    title: 'Components/Authentication',
    id: 'auth-flow',
    tags: ['autodocs'],
    args: { title: 'Plan dinners, shop together', mark: '🧺', signIn: fn() },
    parameters: {
        docs: {
            description: {
                component:
                    'Passkey sign-in, email signup, email verification, and session restoration. Each screen takes links, actions, and reactive feedback from the app. Omit sign-in actions when the browser cannot use passkeys.',
            },
        },
    },
    render: ({ title, mark, signIn }) =>
        renderNordStory(() => SignInScreen({ title, mark, actions: { signIn, signUpHref, error: grain('') } })),
} satisfies Meta<SignInArgs>;

type Story = StoryObj<SignInArgs>;
const parameters = { controls: { disable: true } };

export const SignIn = {
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Sign in with a passkey' }));
        await expect(args.signIn).toHaveBeenCalledOnce();
        await expect(canvas.getByRole('link', { name: 'Create an account' })).toHaveAttribute('href', signUpHref);
    },
} satisfies Story;

export const PasskeysUnavailable = {
    render: ({ title, mark }) => renderNordStory(() => SignInScreen({ title, mark })),
    argTypes: { signIn: { table: { disable: true } } },
} satisfies Story;

export const SignUp = {
    parameters,
    render: () =>
        renderNordStory(() => {
            const { controls } = form({ email: '' });
            const sent = grain(false);
            return SignUpScreen({
                email: controls.email,
                submit: () => sent.set(true),
                sent,
                error: grain(''),
                signInHref,
            });
        }),
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByRole('textbox', { name: 'Email address' }), 'cook@example.com');
        await userEvent.click(canvas.getByRole('button', { name: 'Send verification link' }));
        await expect(canvas.getByRole('status')).toHaveTextContent('Check your email for a verification link.');
    },
} satisfies Story;

export const EmailSent = {
    parameters,
    render: () =>
        renderNordStory(() =>
            SignUpScreen({
                email: form({ email: 'cook@example.com' }).controls.email,
                submit: fn(),
                sent: grain(true),
                error: grain(''),
                signInHref,
            }),
        ),
} satisfies Story;

export const VerifyEmail = {
    parameters,
    render: () =>
        renderNordStory(() => VerifyEmailScreen({ register: fn(), error: grain(''), signInHref, signUpHref })),
} satisfies Story;

export const ExpiredLink = {
    parameters,
    render: () =>
        renderNordStory(() =>
            VerifyEmailScreen({
                register: fn(),
                error: grain('This verification link expired or has already been used. Request a new one.'),
                signInHref,
                signUpHref,
            }),
        ),
} satisfies Story;

export const CheckingSession = {
    parameters,
    render: () => renderNordStory(() => SessionStatusScreen({ state: 'checking' })),
} satisfies Story;

export const SessionError = {
    parameters,
    render: () => renderNordStory(() => SessionStatusScreen({ state: 'error', retry: fn() })),
} satisfies Story;

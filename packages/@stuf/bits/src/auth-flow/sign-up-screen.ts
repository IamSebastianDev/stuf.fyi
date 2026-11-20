import type { Control } from '@grainular/forms';
import { $if, attr, html, on, type Subscribable } from '@grainular/nord';
import { Button } from '../button/button';
import { ControlContainer } from '../control-container/control-container';
import { Text } from '../text/text';
import { TextField } from '../text-field/text-field';
import { RegistrationScreen } from './registration-screen';

/** The email control and verification-link request state supplied by the app. */
export type SignUpScreenProps = {
    email: Control<string>;
    submit: () => void;
    sent: Subscribable<boolean>;
    error: Subscribable<string>;
    signInHref: string;
};

const RegistrationEmailForm = ({ email, submit, sent, error, signInHref }: SignUpScreenProps) => {
    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        submit();
    };

    return html`
        <form class="registration-actions" ${on('submit', handleSubmit)}>
            ${ControlContainer({
                control: email,
                name: 'email',
                label: 'Email address',
                children: (props) =>
                    TextField({ ...props, type: 'email', autocomplete: 'email', maxLength: 254, required: true }),
            })}
            <button type="submit" ${Button({ appearance: 'inverse', layout: 'full' })}>Send verification link</button>
            <p class="registration-message" ${Text({ size: 'caption' })} role="status">
                ${$if(sent).$then(() => html`Check your email for a verification link.`)}
            </p>
            <p class="registration-message registration-error" ${Text({ size: 'caption' })} role="alert">${error}</p>
            <a ${attr({ href: signInHref })} ${Button({ appearance: 'plain', layout: 'full' })}>Back to sign in</a>
        </form>
    `;
};

/** Collects the signup address and confirms when the verification link was requested. */
export const SignUpScreen = (props: SignUpScreenProps) =>
    RegistrationScreen({
        title: 'Create an account',
        description: 'Verify your email before creating a passkey.',
        content: RegistrationEmailForm(props),
    });

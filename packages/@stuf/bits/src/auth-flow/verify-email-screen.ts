import { attr, html, on, type Subscribable } from '@grainular/nord';
import { Button } from '../button/button';
import { Text } from '../text/text';
import { RegistrationScreen } from './registration-screen';

/** Passkey creation action and recovery links for the verification step. */
export type VerifyEmailScreenProps = {
    register: () => void;
    error: Subscribable<string>;
    signInHref: string;
    signUpHref: string;
};

const VerifiedRegistration = ({ register, error, signInHref, signUpHref }: VerifyEmailScreenProps) => html`
    <div class="registration-actions">
        <button type="button" ${Button({ appearance: 'inverse', layout: 'full' })} ${on('click', register)}>
            Create a passkey
        </button>
        <p class="registration-message registration-error" ${Text({ size: 'caption' })} role="alert">${error}</p>
        <a ${attr({ href: signInHref })} ${Button({ appearance: 'plain', layout: 'full' })}>Back to sign in</a>
        <a ${attr({ href: signUpHref })} ${Button({ appearance: 'plain', layout: 'full' })}>Request a new link</a>
    </div>
`;

/** Provides the user action that starts passkey creation after opening the email link. */
export const VerifyEmailScreen = (props: VerifyEmailScreenProps) =>
    RegistrationScreen({
        title: 'Finish signing up',
        description: 'Create a passkey to finish setting up your account.',
        content: VerifiedRegistration(props),
    });

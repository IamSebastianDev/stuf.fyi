import { VerifyEmailScreen } from '@stuf/bits/auth-flow';
import { createVerifiedRegistration } from '../controllers/registration.controller';

/** Connects the email verification route to passkey registration. */
export default function VerifyEmailPage() {
    return VerifyEmailScreen({
        ...createVerifiedRegistration(),
        signInHref: '/sign-in',
        signUpHref: '/sign-up',
    });
}

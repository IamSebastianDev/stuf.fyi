import { SignUpScreen } from '@stuf/bits/auth-flow';
import { createRegistrationEmailForm } from '../controllers/registration.controller';

/** Connects account creation to the email verification request. */
export default function SignUpPage() {
    return SignUpScreen({ ...createRegistrationEmailForm(), signInHref: '/sign-in' });
}

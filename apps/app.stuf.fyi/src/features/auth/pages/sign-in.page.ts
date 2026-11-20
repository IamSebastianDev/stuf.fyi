import { SignInScreen } from '@stuf/bits/auth-flow';
import { createPasskeySignIn } from '../controllers/passkey-sign-in.controller';
import { supportsPasskeys } from '../stores/auth.store';

/** Connects passkey sign-in to the app routes. */
export default function SignInPage() {
    return SignInScreen({
        title: 'Plan dinners, shop together',
        mark: '🧺',
        actions: supportsPasskeys() ? { ...createPasskeySignIn(), signUpHref: '/sign-up' } : undefined,
    });
}

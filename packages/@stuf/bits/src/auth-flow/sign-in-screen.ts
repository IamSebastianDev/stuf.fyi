import { attr, html, on, type Fragment, type Subscribable } from '@grainular/nord';
import { KeyRound } from 'lucide';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { Surface } from '../surface/surface';
import { Text } from '../text/text';
import './auth-flow.css';

type SignInActions = {
    signIn: () => void;
    signUpHref: string;
    error: Subscribable<string>;
};

/** Product branding and the actions available on this device. */
export type SignInScreenProps = {
    title: string;
    /** Decorative product mark shown above the title. */
    mark?: string | Fragment;
    /** Omit when passkeys are unavailable on this device. */
    actions?: SignInActions;
};

const PasskeyIntro = ({ title, mark }: Pick<SignInScreenProps, 'title' | 'mark'>) => html`
    <header class="passkey-intro">
        ${mark === undefined ? null : html`<span class="passkey-mark" ${Surface()} aria-hidden="true">${mark}</span>`}
        <h1 ${Text({ size: 'heading' })}>${title}</h1>
        <p ${Text({ appearance: 'muted' })}>
            Use a passkey with Face ID, Touch ID, your fingerprint, or your device PIN.
        </p>
    </header>
`;

const PasskeyActions = ({ signIn, signUpHref, error }: SignInActions) => html`
    <button type="button" ${Button({ appearance: 'inverse', layout: 'full', size: 'lg' })} ${on('click', signIn)}>
        <svg ${Icon({ icon: KeyRound })}></svg>
        Sign in with a passkey
    </button>
    <a ${attr({ href: signUpHref })} ${Button({ appearance: 'plain', layout: 'full' })}>Create an account</a>
    <p class="passkey-error" ${Text({ size: 'caption' })} role="status">${error}</p>
`;

/** Shows passkey sign-in and a link to signup when passkeys are available. */
export const SignInScreen = ({ title, mark, actions }: SignInScreenProps) => html`
    <main stuf-auth-screen class="passkey-screen">
        ${PasskeyIntro({ title, mark })}
        <div class="passkey-actions">
            ${
                actions
                    ? PasskeyActions(actions)
                    : html`<p ${Text({ appearance: 'muted' })}>
                          Open this app in a browser that supports passkeys to continue.
                      </p>`
            }
        </div>
    </main>
`;

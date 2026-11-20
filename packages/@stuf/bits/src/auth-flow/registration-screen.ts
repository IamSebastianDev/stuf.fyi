import { html, type Fragment } from '@grainular/nord';
import { Text } from '../text/text';
import './auth-flow.css';

type RegistrationScreenProps = {
    title: string;
    description: string;
    content: Fragment;
};

/** Shared layout for the email and passkey steps of account creation. */
export const RegistrationScreen = ({ title, description, content }: RegistrationScreenProps) => html`
    <main stuf-auth-screen class="registration-screen">
        <header>
            <h1 ${Text({ size: 'heading' })}>${title}</h1>
            <p ${Text({ appearance: 'muted' })}>${description}</p>
        </header>
        ${content}
    </main>
`;

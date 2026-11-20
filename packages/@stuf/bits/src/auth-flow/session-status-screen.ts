import { html, on } from '@grainular/nord';
import { Button } from '../button/button';
import { Text } from '../text/text';
import './auth-flow.css';

type SessionStatusScreenProps = { state: 'checking' } | { state: 'error'; retry: () => void };

/** Shows session restoration progress or offers a retry after a failed check. */
export const SessionStatusScreen = (props: SessionStatusScreenProps) => html`
    <main stuf-auth-screen class="session-status-screen">
        ${
            props.state === 'error'
                ? html`
                      <h1 ${Text({ size: 'heading' })}>Couldn’t check your session</h1>
                      <button type="button" ${Button()} ${on('click', props.retry)}>Try again</button>
                  `
                : html`<p ${Text({ appearance: 'muted' })} role="status">Checking your session…</p>`
        }
    </main>
`;

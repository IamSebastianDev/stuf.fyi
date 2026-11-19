import { attr, html, type Subscribable } from '@grainular/nord';
import { Icon } from '@stuf/bits/icon';
import { Text } from '@stuf/bits/text';
import { Check } from 'lucide';
import './passkey-feedback.css';

export type PasskeyPhase = 'idle' | 'pending' | 'verified' | 'error';

type PasskeyFeedbackProps = {
    phase: Subscribable<PasskeyPhase>;
    message: Subscribable<string>;
};

export const PasskeyFeedback = ({ phase, message }: PasskeyFeedbackProps) => html`
    <div class="passkey-feedback" ${attr({ 'data-phase': phase })}>
        <div class="passkey-feedback-panel">
            <span class="passkey-feedback-icon" aria-hidden="true">
                <svg ${Icon({ icon: Check, size: 'md' })}></svg>
            </span>
            <p ${Text({ appearance: 'muted' })} role="status">${message}</p>
        </div>
    </div>
`;

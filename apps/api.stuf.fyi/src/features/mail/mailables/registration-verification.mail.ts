import { Injectable } from '@nestjs/common';
import type { Mailable } from '@nestjs/mail';

type RegistrationVerificationMailData = {
    verificationUrl: string;
};

/** Email sent before a new account can register a passkey. */
@Injectable()
export class RegistrationVerificationMail implements Mailable<RegistrationVerificationMailData> {
    render({ verificationUrl }: RegistrationVerificationMailData) {
        return {
            subject: 'Verify your email for Stuf',
            text: [
                'Open this link to verify your email and create a Stuf account:',
                verificationUrl,
                'If you already have a Stuf account, sign in with your passkey. If you didn’t request this email, you can ignore it.',
            ].join('\n\n'),
        };
    }
}

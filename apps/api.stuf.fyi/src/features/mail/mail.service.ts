import { Injectable } from '@nestjs/common';
import { Mailer } from '@nestjs/mail';
import { RegistrationVerificationMail } from './mailables/registration-verification.mail';

@Injectable()
export class MailService {
    constructor(private readonly mailer: Mailer) {}

    /** Delivers the signup link supplied by the auth feature. */
    async sendRegistrationVerification(to: string, verificationUrl: string): Promise<void> {
        await this.mailer.send(RegistrationVerificationMail, {
            to,
            data: { verificationUrl },
        });
    }
}

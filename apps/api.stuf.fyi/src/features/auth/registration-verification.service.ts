import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthErrorCode } from '@stuf/contracts/auth';
import { Prisma } from '@stuf/prisma';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../../core/prisma/prisma.service';
import { MailService } from '../mail/mail.service';

type VerificationClient = Pick<PrismaService['client'], 'registrationEmailVerification'>;

@Injectable()
export class RegistrationVerificationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
        private readonly mail: MailService,
    ) {}

    /** Sends a short-lived link, allowing one delivery per address during the resend interval. */
    async sendLink(email: string, origin: string): Promise<void> {
        const token = randomBytes(32).toString('base64url');
        const tokenHash = this.hash(token);
        const url = new URL('/sign-up/verify', origin);
        url.hash = new URLSearchParams({ token }).toString();
        const now = Date.now();
        const data = {
            tokenHash,
            requestedAt: new Date(now),
            expiresAt: new Date(now + this.verificationTtlMs),
        };

        const verifications = this.prisma.client.registrationEmailVerification;
        const resendCutoff = new Date(now - this.resendIntervalMs);
        await verifications.deleteMany({
            where: { expiresAt: { lte: new Date(now) }, requestedAt: { lte: resendCutoff } },
        });
        // An atomic update or insert prevents concurrent requests from sending two emails.
        const replaced = await verifications.updateMany({
            where: { email, requestedAt: { lte: resendCutoff } },
            data,
        });
        if (!replaced.count) {
            const created = await verifications.createMany({ data: { email, ...data }, skipDuplicates: true });
            if (!created.count) return;
        }

        try {
            await this.mail.sendRegistrationVerification(email, url.href);
        } catch {
            await verifications.deleteMany({ where: { tokenHash } });
            throw this.deliveryUnavailable();
        }
    }

    /** Reads the email proof before opening the browser's passkey creation prompt. */
    async getVerification(token: string) {
        const verification = await this.prisma.client.registrationEmailVerification.findUnique({
            where: { tokenHash: this.hash(token), expiresAt: { gt: new Date() } },
            select: { email: true, tokenHash: true },
        });
        if (!verification) throw this.invalidLink();
        return verification;
    }

    /** Claims the proof inside the account transaction so only one signup can use it. */
    async consume(client: VerificationClient, tokenHash: string, now: Date): Promise<string> {
        try {
            const { email } = await client.registrationEmailVerification.delete({
                where: { tokenHash, expiresAt: { gt: now } },
                select: { email: true },
            });
            return email;
        } catch (cause) {
            if (cause instanceof Prisma.PrismaClientKnownRequestError && cause.code === 'P2025') {
                throw this.invalidLink();
            }
            throw cause;
        }
    }

    private hash(token: string) {
        return createHash('sha256').update(token).digest('hex');
    }

    private invalidLink() {
        return new BadRequestException({
            errorCode: AuthErrorCode.RegistrationEmailLinkInvalid,
            message: 'This verification link is invalid, expired, or already used',
        });
    }

    private deliveryUnavailable() {
        return new ServiceUnavailableException({
            errorCode: AuthErrorCode.RegistrationEmailUnavailable,
            message: 'Verification email is temporarily unavailable',
        });
    }

    private get verificationTtlMs() {
        return Number(this.config.get('AUTH_EMAIL_VERIFICATION_TTL_MS', '900000'));
    }

    private get resendIntervalMs() {
        return Number(this.config.get('AUTH_EMAIL_RESEND_INTERVAL_MS', '60000'));
    }
}

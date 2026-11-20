import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    generateAuthenticationOptions,
    generateRegistrationOptions,
    verifyAuthenticationResponse,
    verifyRegistrationResponse,
    type AuthenticationResponseJSON,
    type RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { AuthErrorCode } from '@stuf/contracts/auth';
import type { PasskeyCredential } from '@stuf/prisma';
import { SessionService } from '../session/session.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { RegistrationVerificationService } from './registration-verification.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly config: ConfigService,
        private readonly sessions: SessionService,
        private readonly users: UserService,
        private readonly registrationVerification: RegistrationVerificationService,
    ) {}

    async sendRegistrationEmail(email: string): Promise<void> {
        await this.registrationVerification.sendLink(email, this.origin);
    }

    async createRegistrationOptions(token: string) {
        const { email, tokenHash } = await this.registrationVerification.getVerification(token);
        if (await this.users.findByEmail(email)) {
            throw new ConflictException({
                errorCode: AuthErrorCode.RegistrationEmailAlreadyUsed,
                message: 'An account already exists for this email',
            });
        }

        const options = await generateRegistrationOptions({
            rpName: this.config.get('WEBAUTHN_RP_NAME', 'Stuf'),
            rpID: this.rpID,
            userName: email,
            userDisplayName: email,
            authenticatorSelection: {
                residentKey: 'required',
                userVerification: 'required',
            },
            attestationType: 'none',
        });

        const expiresInMs = this.challengeTtlMs;
        await this.prismaService.client.webAuthnChallenge.create({
            data: {
                challenge: options.challenge,
                purpose: 'REGISTRATION',
                webAuthnUserId: options.user.id,
                emailVerificationHash: tokenHash,
                expiresAt: new Date(Date.now() + expiresInMs),
            },
        });

        return { options, expiresInMs };
    }

    async registerPasskey(response: RegistrationResponseJSON, challenge: string | undefined) {
        const storedChallenge = await this.getChallenge(challenge, 'REGISTRATION');
        const verification = await this.verifyRegistration(response, storedChallenge.challenge);

        if (!verification.verified || !storedChallenge.webAuthnUserId || !storedChallenge.emailVerificationHash) {
            throw new BadRequestException({
                errorCode: AuthErrorCode.WebAuthnVerificationFailed,
                message: 'Passkey registration could not be verified',
            });
        }
        const { webAuthnUserId, emailVerificationHash } = storedChallenge;

        const existingCredential = await this.prismaService.client.passkeyCredential.findUnique({
            where: { credentialId: verification.registrationInfo.credential.id },
        });
        if (existingCredential) {
            throw new ConflictException({
                errorCode: AuthErrorCode.PasskeyAlreadyRegistered,
                message: 'Passkey is already registered',
            });
        }

        const now = new Date();
        return this.prismaService.client.$transaction(async (transaction) => {
            const email = await this.registrationVerification.consume(transaction, emailVerificationHash, now);
            const user = await transaction.user.create({
                data: {
                    email,
                    webAuthnUserId,
                    passkeys: {
                        create: {
                            credentialId: verification.registrationInfo.credential.id,
                            publicKey: Buffer.from(verification.registrationInfo.credential.publicKey),
                            counter: BigInt(verification.registrationInfo.credential.counter),
                            deviceType: verification.registrationInfo.credentialDeviceType,
                            backedUp: verification.registrationInfo.credentialBackedUp,
                            transports: response.response.transports ?? [],
                        },
                    },
                },
            });

            await transaction.webAuthnChallenge.update({
                where: { id: storedChallenge.id },
                data: { consumedAt: now },
            });

            return this.sessions.create(user.id, transaction, now);
        });
    }

    async createAuthenticationOptions() {
        const options = await generateAuthenticationOptions({
            rpID: this.rpID,
            userVerification: 'required',
        });

        const expiresInMs = this.challengeTtlMs;
        await this.prismaService.client.webAuthnChallenge.create({
            data: {
                challenge: options.challenge,
                purpose: 'AUTHENTICATION',
                expiresAt: new Date(Date.now() + expiresInMs),
            },
        });

        return { options, expiresInMs };
    }

    async authenticatePasskey(response: AuthenticationResponseJSON, challenge: string | undefined) {
        const storedChallenge = await this.getChallenge(challenge, 'AUTHENTICATION');
        const passkey = await this.prismaService.client.passkeyCredential.findUnique({
            where: { credentialId: response.id },
        });
        const user = passkey && (await this.users.findById(passkey.userId));

        if (!passkey || !user || user.disabledAt) {
            throw new UnauthorizedException({
                errorCode: AuthErrorCode.PasskeyNotFound,
                message: 'Passkey authentication failed',
            });
        }

        const verification = await this.verifyAuthentication(response, storedChallenge.challenge, passkey);
        if (!verification.verified) {
            throw new UnauthorizedException({
                errorCode: AuthErrorCode.WebAuthnVerificationFailed,
                message: 'Passkey authentication failed',
            });
        }

        const now = new Date();
        return this.prismaService.client.$transaction(async (transaction) => {
            await transaction.passkeyCredential.update({
                where: { id: passkey.id },
                data: {
                    counter: BigInt(verification.authenticationInfo.newCounter),
                    lastUsedAt: now,
                },
            });
            await transaction.webAuthnChallenge.update({
                where: { id: storedChallenge.id },
                data: { consumedAt: now },
            });

            return this.sessions.create(passkey.userId, transaction, now);
        });
    }

    private async verifyRegistration(response: RegistrationResponseJSON, challenge: string) {
        try {
            return await verifyRegistrationResponse({
                response,
                expectedChallenge: challenge,
                expectedOrigin: this.origin,
                expectedRPID: this.rpID,
                requireUserVerification: true,
            });
        } catch {
            throw new BadRequestException({
                errorCode: AuthErrorCode.WebAuthnVerificationFailed,
                message: 'Passkey registration could not be verified',
            });
        }
    }

    private async verifyAuthentication(
        response: AuthenticationResponseJSON,
        challenge: string,
        passkey: PasskeyCredential,
    ) {
        try {
            return await verifyAuthenticationResponse({
                response,
                expectedChallenge: challenge,
                expectedOrigin: this.origin,
                expectedRPID: this.rpID,
                credential: {
                    id: passkey.credentialId,
                    publicKey: new Uint8Array(passkey.publicKey),
                    counter: Number(passkey.counter),
                    transports: passkey.transports,
                },
                requireUserVerification: true,
            });
        } catch {
            throw new UnauthorizedException({
                errorCode: AuthErrorCode.WebAuthnVerificationFailed,
                message: 'Passkey authentication failed',
            });
        }
    }

    private async getChallenge(challenge: string | undefined, purpose: 'REGISTRATION' | 'AUTHENTICATION') {
        if (!challenge) {
            throw new UnauthorizedException({
                errorCode: AuthErrorCode.WebAuthnChallengeMissing,
                message: 'WebAuthn ceremony has expired or was not started',
            });
        }

        const storedChallenge = await this.prismaService.client.webAuthnChallenge.findUnique({
            where: { challenge },
        });
        if (
            !storedChallenge ||
            storedChallenge.purpose !== purpose ||
            storedChallenge.consumedAt ||
            storedChallenge.expiresAt <= new Date()
        ) {
            throw new BadRequestException({
                errorCode: AuthErrorCode.WebAuthnChallengeInvalid,
                message: 'WebAuthn challenge is invalid or expired',
            });
        }
        return storedChallenge;
    }

    private get rpID() {
        return this.config.get('WEBAUTHN_RP_ID', this.config.get('APP_HOST', 'localhost'));
    }

    private get origin() {
        return this.config.get(
            'WEBAUTHN_ORIGIN',
            `http://${this.config.get('APP_HOST', 'localhost')}:${this.config.get('APP_PORT', '5173')}`,
        );
    }

    private get challengeTtlMs() {
        return Number(this.config.get('AUTH_CHALLENGE_TTL_MS', String(5 * 60 * 1000)));
    }
}

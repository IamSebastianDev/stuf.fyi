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
import type { FastifyReply, FastifyRequest } from 'fastify';
import { randomBytes } from 'node:crypto';
import { CookieService } from '../../core/cookies/cookie.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { SessionService } from './session.service';
import { passkeyWithUser, type PasskeyWithUser } from './types/passkey-with-user.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly config: ConfigService,
        private readonly cookies: CookieService,
        private readonly sessions: SessionService,
    ) {}

    async createRegistrationOptions(reply: FastifyReply) {
        const options = await generateRegistrationOptions({
            rpName: this.config.get('WEBAUTHN_RP_NAME', 'Stuf'),
            rpID: this.rpID,
            userName: `user-${randomBytes(6).toString('hex')}`,
            userDisplayName: 'Stuf user',
            authenticatorSelection: {
                residentKey: 'required',
                userVerification: 'required',
            },
            attestationType: 'none',
        });

        await this.prismaService.client.webAuthnChallenge.create({
            data: {
                challenge: options.challenge,
                purpose: 'REGISTRATION',
                webAuthnUserId: options.user.id,
                expiresAt: new Date(Date.now() + this.challengeTtlMs),
            },
        });

        this.cookies.set(reply, this.registrationChallengeCookieName, options.challenge, this.challengeTtlMs);

        return options;
    }

    async registerPasskey(response: RegistrationResponseJSON, request: FastifyRequest, reply: FastifyReply) {
        const challenge = this.requireChallenge(request, this.registrationChallengeCookieName);
        const storedChallenge = await this.getChallenge(challenge, 'REGISTRATION');
        const verification = await this.verifyRegistration(response, storedChallenge.challenge);

        if (!verification.verified || !storedChallenge.webAuthnUserId) {
            throw new BadRequestException({
                errorCode: 'WEBAUTHN_VERIFICATION_FAILED',
                message: 'Passkey registration could not be verified',
            });
        }
        const webAuthnUserId = storedChallenge.webAuthnUserId;

        const existingCredential = await this.prismaService.client.passkeyCredential.findUnique({
            where: { credentialId: verification.registrationInfo.credential.id },
        });
        if (existingCredential) {
            throw new ConflictException({
                errorCode: 'PASSKEY_ALREADY_REGISTERED',
                message: 'Passkey is already registered',
            });
        }

        const now = new Date();
        const session = await this.prismaService.client.$transaction(async (transaction) => {
            const user = await transaction.user.create({
                data: {
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

        this.finishCeremony(reply, this.registrationChallengeCookieName, session.sessionToken);
        return this.sessions.toResponse(session.session);
    }

    async createAuthenticationOptions(reply: FastifyReply) {
        const options = await generateAuthenticationOptions({
            rpID: this.rpID,
            userVerification: 'required',
        });

        await this.prismaService.client.webAuthnChallenge.create({
            data: {
                challenge: options.challenge,
                purpose: 'AUTHENTICATION',
                expiresAt: new Date(Date.now() + this.challengeTtlMs),
            },
        });

        this.cookies.set(reply, this.authenticationChallengeCookieName, options.challenge, this.challengeTtlMs);

        return options;
    }

    async authenticatePasskey(response: AuthenticationResponseJSON, request: FastifyRequest, reply: FastifyReply) {
        const challenge = this.requireChallenge(request, this.authenticationChallengeCookieName);
        const storedChallenge = await this.getChallenge(challenge, 'AUTHENTICATION');
        const passkey = await this.prismaService.client.passkeyCredential.findUnique({
            where: { credentialId: response.id },
            include: passkeyWithUser,
        });

        if (!passkey || passkey.user.disabledAt) {
            throw new UnauthorizedException({
                errorCode: 'PASSKEY_NOT_FOUND',
                message: 'Passkey authentication failed',
            });
        }

        const verification = await this.verifyAuthentication(response, storedChallenge.challenge, passkey);
        if (!verification.verified) {
            throw new UnauthorizedException({
                errorCode: 'WEBAUTHN_VERIFICATION_FAILED',
                message: 'Passkey authentication failed',
            });
        }

        const now = new Date();
        const session = await this.prismaService.client.$transaction(async (transaction) => {
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

        this.finishCeremony(reply, this.authenticationChallengeCookieName, session.sessionToken);
        return this.sessions.toResponse(session.session);
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
                errorCode: 'WEBAUTHN_VERIFICATION_FAILED',
                message: 'Passkey registration could not be verified',
            });
        }
    }

    private async verifyAuthentication(
        response: AuthenticationResponseJSON,
        challenge: string,
        passkey: PasskeyWithUser,
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
                errorCode: 'WEBAUTHN_VERIFICATION_FAILED',
                message: 'Passkey authentication failed',
            });
        }
    }

    private finishCeremony(reply: FastifyReply, challengeCookieName: string, sessionToken: string) {
        this.cookies.clear(reply, challengeCookieName);
        this.sessions.setCookie(reply, sessionToken);
    }

    private requireChallenge(request: FastifyRequest, cookieName: string) {
        const challenge = this.cookies.get(request, cookieName);
        if (!challenge) {
            throw new UnauthorizedException({
                errorCode: 'WEBAUTHN_CHALLENGE_MISSING',
                message: 'WebAuthn ceremony has expired or was not started',
            });
        }
        return challenge;
    }

    private async getChallenge(challenge: string, purpose: 'REGISTRATION' | 'AUTHENTICATION') {
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
                errorCode: 'WEBAUTHN_CHALLENGE_INVALID',
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

    private get registrationChallengeCookieName() {
        return this.config.get('AUTH_REGISTRATION_CHALLENGE_COOKIE_NAME', 'stuf_registration_challenge');
    }

    private get authenticationChallengeCookieName() {
        return this.config.get('AUTH_AUTHENTICATION_CHALLENGE_COOKIE_NAME', 'stuf_authentication_challenge');
    }
}

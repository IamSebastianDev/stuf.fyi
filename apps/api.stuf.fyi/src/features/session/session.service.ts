import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthErrorCode, type AuthSessionResponseInput } from '@stuf/contracts/auth';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../../core/prisma/prisma.service';
import { sessionIdentitySelect, type SessionIdentity } from './types/session-identity.type';
import { sessionWithUserPasskeys, type SessionWithUserPasskeys } from './types/session-with-user-passkeys.type';

type SessionClient = Pick<PrismaService['client'], 'session'>;

@Injectable()
export class SessionService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly config: ConfigService,
    ) {}

    async create(userId: string, client: SessionClient = this.prismaService.client, now = new Date()) {
        const sessionToken = this.createSessionToken();
        const expiresInMs = this.sessionTtlMs;
        const session = await client.session.create({
            data: {
                userId,
                tokenHash: this.hashSessionToken(sessionToken),
                expiresAt: new Date(now.getTime() + expiresInMs),
            },
            include: sessionWithUserPasskeys,
        });

        return { sessionToken, session: this.toResponse(session), expiresInMs };
    }

    async getCurrentSession(sessionToken: string | undefined) {
        const session = await this.prismaService.client.session.findUnique({
            where: { tokenHash: this.requireTokenHash(sessionToken) },
            include: sessionWithUserPasskeys,
        });
        return this.toResponse(await this.requireActiveSession(session));
    }

    /** Verifies the cookie session and returns the user ID for a protected request. */
    async requireUserId(sessionToken: string | undefined): Promise<string> {
        const session = await this.prismaService.client.session.findUnique({
            where: { tokenHash: this.requireTokenHash(sessionToken) },
            select: sessionIdentitySelect,
        });
        const { userId } = await this.requireActiveSession(session);
        return userId;
    }

    async revoke(sessionToken: string | undefined): Promise<void> {
        if (!sessionToken) return;

        await this.prismaService.client.session.updateMany({
            where: { tokenHash: this.hashSessionToken(sessionToken), revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }

    private toResponse(session: SessionWithUserPasskeys): AuthSessionResponseInput {
        const { user } = session;
        return { user, passkeys: user.passkeys };
    }

    private requireTokenHash(sessionToken: string | undefined): string {
        if (!sessionToken) throw this.authenticationRequired();

        return this.hashSessionToken(sessionToken);
    }

    private async requireActiveSession<T extends SessionIdentity>(session: T | null): Promise<T> {
        const now = new Date();
        if (!session || session.revokedAt || session.expiresAt <= now || session.user.disabledAt) {
            throw this.authenticationRequired();
        }

        await this.prismaService.client.session.update({
            where: { id: session.id },
            data: { lastUsedAt: now },
        });
        return session;
    }

    private createSessionToken() {
        return randomBytes(32).toString('base64url');
    }

    private hashSessionToken(token: string) {
        return createHash('sha256').update(token).digest('hex');
    }

    private authenticationRequired() {
        return new UnauthorizedException({
            errorCode: AuthErrorCode.AuthenticationRequired,
            message: 'Authentication required',
        });
    }

    private get sessionTtlMs() {
        return Number(this.config.get('AUTH_SESSION_TTL_MS', String(30 * 24 * 60 * 60 * 1000)));
    }
}

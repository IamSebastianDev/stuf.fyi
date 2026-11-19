import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createHash, randomBytes } from 'node:crypto';
import { CookieService } from '../../core/cookies/cookie.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { sessionIdentitySelect, type SessionIdentity } from './types/session-identity.type';
import { sessionWithUserPasskeys, type SessionWithUserPasskeys } from './types/session-with-user-passkeys.type';

type SessionClient = Pick<PrismaService['client'], 'session'>;

@Injectable()
export class SessionService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly config: ConfigService,
        private readonly cookies: CookieService,
    ) {}

    async create(userId: string, client: SessionClient = this.prismaService.client, now = new Date()) {
        const sessionToken = this.createSessionToken();
        const session = await client.session.create({
            data: {
                userId,
                tokenHash: this.hashSessionToken(sessionToken),
                expiresAt: new Date(now.getTime() + this.sessionTtlMs),
            },
            include: sessionWithUserPasskeys,
        });

        return { sessionToken, session };
    }

    async getCurrentSession(request: FastifyRequest) {
        const session = await this.prismaService.client.session.findUnique({
            where: { tokenHash: this.requireTokenHash(request) },
            include: sessionWithUserPasskeys,
        });
        return this.toResponse(await this.requireActiveSession(session));
    }

    /** Verifies the cookie session and returns the user ID for a protected request. */
    async requireUserId(request: FastifyRequest): Promise<string> {
        const session = await this.prismaService.client.session.findUnique({
            where: { tokenHash: this.requireTokenHash(request) },
            select: sessionIdentitySelect,
        });
        const { userId } = await this.requireActiveSession(session);
        return userId;
    }

    async revoke(request: FastifyRequest, reply: FastifyReply) {
        const sessionToken = this.cookies.get(request, this.sessionCookieName);
        if (sessionToken) {
            await this.prismaService.client.session.updateMany({
                where: { tokenHash: this.hashSessionToken(sessionToken), revokedAt: null },
                data: { revokedAt: new Date() },
            });
        }

        this.cookies.clear(reply, this.sessionCookieName);
    }

    setCookie(reply: FastifyReply, sessionToken: string) {
        this.cookies.set(reply, this.sessionCookieName, sessionToken, this.sessionTtlMs);
    }

    toResponse(session: SessionWithUserPasskeys) {
        const { user, ...sessionData } = session;
        return { user, session: sessionData, passkeys: user.passkeys };
    }

    private requireTokenHash(request: FastifyRequest): string {
        const sessionToken = this.cookies.get(request, this.sessionCookieName);
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
            errorCode: 'AUTHENTICATION_REQUIRED',
            message: 'Authentication required',
        });
    }

    private get sessionTtlMs() {
        return Number(this.config.get('AUTH_SESSION_TTL_MS', String(30 * 24 * 60 * 60 * 1000)));
    }

    private get sessionCookieName() {
        return this.config.get('AUTH_SESSION_COOKIE_NAME', 'stuf_session');
    }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { CookieService } from '../../core/cookies/cookie.service';

const challengeCookies = {
    registration: { key: 'AUTH_REGISTRATION_CHALLENGE_COOKIE_NAME', defaultName: 'stuf_registration_challenge' },
    authentication: { key: 'AUTH_AUTHENTICATION_CHALLENGE_COOKIE_NAME', defaultName: 'stuf_authentication_challenge' },
} as const;

type Ceremony = keyof typeof challengeCookies;

/** Keeps the challenge cookie separate for each kind of passkey ceremony. */
@Injectable()
export class ChallengeCookieService {
    constructor(
        private readonly cookies: CookieService,
        private readonly config: ConfigService,
    ) {}

    get(request: FastifyRequest, ceremony: Ceremony) {
        return this.cookies.get(request, this.name(ceremony));
    }

    set(reply: FastifyReply, ceremony: Ceremony, challenge: string, expiresInMs: number) {
        this.cookies.set(reply, this.name(ceremony), challenge, expiresInMs);
    }

    clear(reply: FastifyReply, ceremony: Ceremony) {
        this.cookies.clear(reply, this.name(ceremony));
    }

    private name(ceremony: Ceremony) {
        const { key, defaultName } = challengeCookies[ceremony];
        return this.config.get(key, defaultName);
    }
}

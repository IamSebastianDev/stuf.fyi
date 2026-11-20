import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { CookieService } from '../../core/cookies/cookie.service';

/** Applies the API's session cookie name and policy to an opaque session token. */
@Injectable()
export class SessionCookieService {
    constructor(
        private readonly cookies: CookieService,
        private readonly config: ConfigService,
    ) {}

    get(request: FastifyRequest) {
        return this.cookies.get(request, this.name);
    }

    set(reply: FastifyReply, token: string, expiresInMs: number) {
        this.cookies.set(reply, this.name, token, expiresInMs);
    }

    clear(reply: FastifyReply) {
        this.cookies.clear(reply, this.name);
    }

    private get name() {
        return this.config.get('AUTH_SESSION_COOKIE_NAME', 'stuf_session');
    }
}

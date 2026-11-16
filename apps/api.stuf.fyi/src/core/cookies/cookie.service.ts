import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class CookieService {
    constructor(private readonly config: ConfigService) {}

    get(request: FastifyRequest, name: string) {
        return request.cookies[name];
    }

    set(reply: FastifyReply, name: string, value: string, maxAgeMs: number) {
        reply.setCookie(name, value, {
            path: '/',
            secure: this.config.get('NODE_ENV', 'development') === 'production',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: Math.floor(maxAgeMs / 1000),
        });
    }

    clear(reply: FastifyReply, name: string) {
        reply.clearCookie(name, { path: '/' });
    }
}

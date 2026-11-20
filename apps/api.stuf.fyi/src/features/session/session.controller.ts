import { Controller, Get, HttpCode, HttpStatus, Post, Req, Res, SerializeOptions } from '@nestjs/common';
import { AuthSessionResponseSchema, type AuthSessionResponseInput } from '@stuf/contracts/auth';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { SessionCookieService } from './session-cookie.service';
import { SessionService } from './session.service';

@Controller({ version: '1', path: '/auth' })
export class SessionController {
    constructor(
        private readonly sessions: SessionService,
        private readonly sessionCookie: SessionCookieService,
    ) {}

    @Get('session')
    @SerializeOptions({ schema: AuthSessionResponseSchema })
    getSession(@Req() request: FastifyRequest): Promise<AuthSessionResponseInput> {
        return this.sessions.getCurrentSession(this.sessionCookie.get(request));
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
        await this.sessions.revoke(this.sessionCookie.get(request));
        this.sessionCookie.clear(reply);
    }
}

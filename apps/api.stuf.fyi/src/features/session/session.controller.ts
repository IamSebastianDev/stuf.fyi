import { Controller, Get, HttpCode, Post, Req, Res, SerializeOptions } from '@nestjs/common';
import { AuthSessionResponseSchema, type AuthSessionResponseInput } from '@stuf/contracts/auth';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { SessionService } from './session.service';

@Controller({ version: '1', path: '/auth' })
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @Get('session')
    @SerializeOptions({ schema: AuthSessionResponseSchema })
    getSession(@Req() request: FastifyRequest): Promise<AuthSessionResponseInput> {
        return this.sessionService.getCurrentSession(request);
    }

    @Post('logout')
    @HttpCode(204)
    logout(@Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
        return this.sessionService.revoke(request, reply);
    }
}

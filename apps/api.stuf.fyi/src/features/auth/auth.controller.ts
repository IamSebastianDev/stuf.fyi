import { Body, Controller, Get, HttpCode, Post, Req, Res, SerializeOptions } from '@nestjs/common';
import { type AuthenticationResponseJSON, type RegistrationResponseJSON } from '@simplewebauthn/server';
import { AuthSessionResponseSchema, type AuthSessionResponseDto } from '@stuf/contracts/auth';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';

@Controller({ version: '1', path: '/auth' })
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly sessionService: SessionService,
    ) {}

    @Post('passkeys/register/options')
    getRegistrationOptions(@Res({ passthrough: true }) reply: FastifyReply) {
        return this.authService.createRegistrationOptions(reply);
    }

    @Post('passkeys/register/verify')
    @SerializeOptions({ schema: AuthSessionResponseSchema })
    verifyRegistration(
        @Body() response: RegistrationResponseJSON,
        @Req() request: FastifyRequest,
        @Res({ passthrough: true }) reply: FastifyReply,
    ): Promise<AuthSessionResponseDto> {
        return this.authService.registerPasskey(response, request, reply) as unknown as Promise<AuthSessionResponseDto>;
    }

    @Post('passkeys/authenticate/options')
    getAuthenticationOptions(@Res({ passthrough: true }) reply: FastifyReply) {
        return this.authService.createAuthenticationOptions(reply);
    }

    @Post('passkeys/authenticate/verify')
    @SerializeOptions({ schema: AuthSessionResponseSchema })
    verifyAuthentication(
        @Body() response: AuthenticationResponseJSON,
        @Req() request: FastifyRequest,
        @Res({ passthrough: true }) reply: FastifyReply,
    ): Promise<AuthSessionResponseDto> {
        return this.authService.authenticatePasskey(
            response,
            request,
            reply,
        ) as unknown as Promise<AuthSessionResponseDto>;
    }

    @Get('session')
    @SerializeOptions({ schema: AuthSessionResponseSchema })
    getSession(@Req() request: FastifyRequest): Promise<AuthSessionResponseDto> {
        return this.sessionService.getCurrentSession(request) as unknown as Promise<AuthSessionResponseDto>;
    }

    @Post('logout')
    @HttpCode(204)
    logout(@Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
        return this.sessionService.revoke(request, reply);
    }
}

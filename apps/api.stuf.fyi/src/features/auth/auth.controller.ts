import { Body, Controller, Post, Req, Res, SerializeOptions } from '@nestjs/common';
import { type AuthenticationResponseJSON, type RegistrationResponseJSON } from '@simplewebauthn/server';
import { AuthSessionResponseSchema, type AuthSessionResponseInput } from '@stuf/contracts/auth';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';

@Controller({ version: '1', path: '/auth' })
export class AuthController {
    constructor(private readonly authService: AuthService) {}

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
    ): Promise<AuthSessionResponseInput> {
        return this.authService.registerPasskey(response, request, reply);
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
    ): Promise<AuthSessionResponseInput> {
        return this.authService.authenticatePasskey(response, request, reply);
    }
}

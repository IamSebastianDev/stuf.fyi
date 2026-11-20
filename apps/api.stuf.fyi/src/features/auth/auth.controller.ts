import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, SerializeOptions, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { AuthenticationResponseJSON, RegistrationResponseJSON } from '@simplewebauthn/server';
import {
    AuthSessionResponseSchema,
    RegistrationEmailRequestSchema,
    VerifiedRegistrationRequestSchema,
    type AuthSessionResponseInput,
    type RegistrationEmailRequestDto,
    type VerifiedRegistrationRequestDto,
} from '@stuf/contracts/auth';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { SessionCookieService } from '../session/session-cookie.service';
import { AuthService } from './auth.service';
import { ChallengeCookieService } from './challenge-cookie.service';

@Controller({ version: '1', path: '/auth' })
export class AuthController {
    constructor(
        private readonly auth: AuthService,
        private readonly challengeCookies: ChallengeCookieService,
        private readonly sessionCookie: SessionCookieService,
    ) {}

    @Post('passkeys/register/email')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(ThrottlerGuard)
    sendRegistrationEmail(@Body({ schema: RegistrationEmailRequestSchema }) { email }: RegistrationEmailRequestDto) {
        return this.auth.sendRegistrationEmail(email);
    }

    @Post('passkeys/register/options')
    async getRegistrationOptions(
        @Body({ schema: VerifiedRegistrationRequestSchema }) { token }: VerifiedRegistrationRequestDto,
        @Res({ passthrough: true }) reply: FastifyReply,
    ) {
        const { options, expiresInMs } = await this.auth.createRegistrationOptions(token);
        this.challengeCookies.set(reply, 'registration', options.challenge, expiresInMs);
        return options;
    }

    @Post('passkeys/register/verify')
    @SerializeOptions({ schema: AuthSessionResponseSchema })
    async verifyRegistration(
        @Body() response: RegistrationResponseJSON,
        @Req() request: FastifyRequest,
        @Res({ passthrough: true }) reply: FastifyReply,
    ): Promise<AuthSessionResponseInput> {
        const challenge = this.challengeCookies.get(request, 'registration');
        const { session, sessionToken, expiresInMs } = await this.auth.registerPasskey(response, challenge);
        this.challengeCookies.clear(reply, 'registration');
        this.sessionCookie.set(reply, sessionToken, expiresInMs);
        return session;
    }

    @Post('passkeys/authenticate/options')
    async getAuthenticationOptions(@Res({ passthrough: true }) reply: FastifyReply) {
        const { options, expiresInMs } = await this.auth.createAuthenticationOptions();
        this.challengeCookies.set(reply, 'authentication', options.challenge, expiresInMs);
        return options;
    }

    @Post('passkeys/authenticate/verify')
    @SerializeOptions({ schema: AuthSessionResponseSchema })
    async verifyAuthentication(
        @Body() response: AuthenticationResponseJSON,
        @Req() request: FastifyRequest,
        @Res({ passthrough: true }) reply: FastifyReply,
    ): Promise<AuthSessionResponseInput> {
        const challenge = this.challengeCookies.get(request, 'authentication');
        const { session, sessionToken, expiresInMs } = await this.auth.authenticatePasskey(response, challenge);
        this.challengeCookies.clear(reply, 'authentication');
        this.sessionCookie.set(reply, sessionToken, expiresInMs);
        return session;
    }
}

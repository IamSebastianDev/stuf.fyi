import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Patch,
    Res,
    SerializeOptions,
    UseGuards,
} from '@nestjs/common';
import {
    UpdateUserProfileRequestSchema,
    UserResponseSchema,
    type UpdateUserProfileRequestDto,
} from '@stuf/contracts/user';
import type { FastifyReply } from 'fastify';
import { SessionCookieService } from '../session/session-cookie.service';
import { SessionUserId } from '../session/session-user-id.decorator';
import { SessionGuard } from '../session/session.guard';
import { UserService } from './user.service';

@Controller({ version: '1', path: '/users' })
@UseGuards(SessionGuard)
export class UserController {
    constructor(
        private readonly users: UserService,
        private readonly sessionCookie: SessionCookieService,
    ) {}

    @Delete('me')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAccount(
        @SessionUserId() userId: string,
        @Res({ passthrough: true }) reply: FastifyReply,
    ): Promise<void> {
        await this.users.deleteAccount(userId);
        this.sessionCookie.clear(reply);
    }

    @Patch('me')
    @SerializeOptions({ schema: UserResponseSchema })
    updateProfile(
        @SessionUserId() userId: string,
        @Body({ schema: UpdateUserProfileRequestSchema }) body: UpdateUserProfileRequestDto,
    ) {
        return this.users.updateProfile(userId, body);
    }
}

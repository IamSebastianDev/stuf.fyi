import { Body, Controller, Patch, SerializeOptions, UseGuards } from '@nestjs/common';
import {
    UpdateUserProfileRequestSchema,
    UserResponseSchema,
    type UpdateUserProfileRequestDto,
} from '@stuf/contracts/user';
import { SessionUserId } from '../session/session-user-id.decorator';
import { SessionGuard } from '../session/session.guard';
import { UserService } from './user.service';

@Controller({ version: '1', path: '/users' })
@UseGuards(SessionGuard)
export class UserController {
    constructor(private readonly users: UserService) {}

    @Patch('me')
    @SerializeOptions({ schema: UserResponseSchema })
    updateProfile(
        @SessionUserId() userId: string,
        @Body({ schema: UpdateUserProfileRequestSchema }) body: UpdateUserProfileRequestDto,
    ) {
        return this.users.updateProfile(userId, body);
    }
}

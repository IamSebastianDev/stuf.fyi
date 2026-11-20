import { Injectable } from '@nestjs/common';
import type { UpdateUserProfileRequestDto } from '@stuf/contracts/user';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    /** Looks up the account by its user ID. */
    findById(userId: string) {
        return this.prisma.client.user.findUnique({ where: { id: userId } });
    }

    /** Applies the supplied profile fields to the user identified by the session. */
    updateProfile(userId: string, fields: UpdateUserProfileRequestDto) {
        return this.prisma.client.user.update({
            where: { id: userId },
            data: fields,
        });
    }
}

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

    /** Checks whether a verified email already belongs to an account. */
    findByEmail(email: string) {
        return this.prisma.client.user.findUnique({ where: { email }, select: { id: true } });
    }

    /** Deletes the account and every list it owns in a single transaction. */
    async deleteAccount(userId: string): Promise<void> {
        await this.prisma.client.$transaction(async (transaction) => {
            await transaction.list.deleteMany({ where: { ownerId: userId } });
            const { webAuthnUserId, email } = await transaction.user.delete({
                where: { id: userId },
                select: { webAuthnUserId: true, email: true },
            });

            // Registration challenges can predate the account and carry its handle instead of its ID.
            await transaction.webAuthnChallenge.deleteMany({ where: { webAuthnUserId } });
            if (email) await transaction.registrationEmailVerification.deleteMany({ where: { email } });
        });
    }

    /** Applies the supplied profile fields to the user identified by the session. */
    updateProfile(userId: string, fields: UpdateUserProfileRequestDto) {
        return this.prisma.client.user.update({
            where: { id: userId },
            data: fields,
        });
    }
}

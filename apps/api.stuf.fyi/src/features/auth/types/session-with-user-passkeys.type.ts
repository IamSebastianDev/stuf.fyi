import type { Prisma } from '@stuf/prisma';

export const sessionWithUserPasskeys = {
    user: {
        include: {
            passkeys: true,
        },
    },
} satisfies Prisma.SessionInclude;

export type SessionWithUserPasskeys = Prisma.SessionGetPayload<{
    include: typeof sessionWithUserPasskeys;
}>;

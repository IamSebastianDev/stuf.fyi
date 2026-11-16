import type { Prisma } from '@stuf/prisma';

export const passkeyWithUser = {
    user: true,
} satisfies Prisma.PasskeyCredentialInclude;

export type PasskeyWithUser = Prisma.PasskeyCredentialGetPayload<{
    include: typeof passkeyWithUser;
}>;

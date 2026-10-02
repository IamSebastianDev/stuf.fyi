import { Prisma } from '../../generated/prisma/client';

export const healthExtension = Prisma.defineExtension((client) =>
    client.$extends({
        name: 'health',

        client: {
            async $healthy() {
                await client.$queryRaw`SELECT 1`;
                return true;
            },
        },
    }),
);

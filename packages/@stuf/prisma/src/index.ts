import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { healthExtension } from './extensions/health.extension';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter }).$extends(healthExtension);

export * from '../generated/prisma/client';

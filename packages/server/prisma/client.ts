// THIS FILE SHOULD NOT BE EDITED UNLESS YOU KNOW WHAT YOU ARE DOING
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prevent multiple instances of Prisma Client in development
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') globalForPrisma.prisma = prisma;

export default prisma;

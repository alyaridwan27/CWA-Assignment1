import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the Prisma Client instance.
// This is necessary because in development, Next.js clears the Node.js cache on every change,
// which would otherwise create many instances of Prisma Client.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Check if we are in production or if a Prisma Client instance already exists.
// If not, create a new instance. Otherwise, reuse the existing global instance.
const prisma = global.prisma || new PrismaClient();

// In development, store the created instance on the global object.
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Export the single Prisma Client instance to be used throughout the application.
export default prisma;

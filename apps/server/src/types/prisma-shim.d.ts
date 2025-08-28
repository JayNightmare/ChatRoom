/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@prisma/client' {
  // Minimal shim; proper types come from generated client during normal dev.
  export const PrismaClient: {
    new (): any;
  } & any;
}

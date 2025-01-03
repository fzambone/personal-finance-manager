import { PrismaClient } from "@prisma/client";
import { logDatabaseQuery } from "@/utils/node-logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClient = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : [],
});

prismaClient.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();

  logDatabaseQuery(params.model + "." + params.action, {
    args: params.args,
    duration: after - before,
  });

  return result;
});

export const prisma = globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

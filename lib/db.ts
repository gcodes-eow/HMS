// lib/db.ts
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Singleton pattern for Prisma Client (prevents multiple instances in dev)
const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

// Store the client in the global scope during development
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in environment variables.");
  }
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

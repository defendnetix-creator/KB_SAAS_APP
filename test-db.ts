import pkg from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
async function main() {
  try {
    console.log("Attempting to connect to:", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    await prisma.$connect();
    console.log("✅ Connected successfully!");
  } catch (e) {
    console.error("❌ Connection failed:");
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();

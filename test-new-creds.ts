import pkg from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const { PrismaClient } = pkg;

async function test(url: string, label: string) {
  console.log(`Testing ${label}...`);
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });
  try {
    await prisma.$connect();
    console.log(`✅ ${label} success!`);
    return true;
  } catch (e: any) {
    console.log(`❌ ${label} failed: ${e.message}`);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const transaction = "postgresql://postgres.mhcnamoszmwokpnonuxk:AkashHoney2024@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  const session = "postgresql://postgres.mhcnamoszmwokpnonuxk:AkashHoney2024@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
  
  await test(transaction, "Transaction Pooler (6543)");
  await test(session, "Session Pooler (5432)");
}

main();

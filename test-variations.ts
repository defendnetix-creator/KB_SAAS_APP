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
  const base = "postgresql://postgres.mhcnamoszmwokpnonuxk:Akashhoney%4011%40%40@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres";
  
  await test(base, "Base URL");
  await test(`${base}?sslmode=require`, "With SSL Require");
  await test(`${base}?pgbouncer=true`, "With PgBouncer");
  await test(`${base}?sslmode=require&pgbouncer=true`, "With SSL & PgBouncer");
}

main();

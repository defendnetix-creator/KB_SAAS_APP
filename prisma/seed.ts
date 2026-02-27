import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.create({
    data: {
      name: 'KB Enterprise',
      slug: 'kb-enterprise'
    }
  });

  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await prisma.user.create({
    data: {
      email: 'admin@kb.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      organizationId: org.id
    }
  });

  await prisma.user.create({
    data: {
      email: 'user@kb.com',
      password: hashedPassword,
      firstName: 'Normal',
      lastName: 'User',
      role: 'USER',
      organizationId: org.id
    }
  });

  const cat1 = await prisma.category.create({
    data: {
      name: 'Servers',
      description: 'On-premise hardware, virtual machines, and cloud instances.',
      icon: 'server',
      organizationId: org.id
    }
  });

  await prisma.article.create({
    data: {
      title: 'How to Reset O365 Password',
      content: 'Step by step guide to resetting Office 365 passwords...',
      categoryId: cat1.id,
      authorId: (await prisma.user.findUnique({ where: { email: 'admin@kb.com' } }))!.id,
      organizationId: org.id,
      status: 'PUBLISHED'
    }
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

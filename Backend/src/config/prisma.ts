import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function connectDB(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('Postgres connected via Prisma');
  } catch (error) {
    console.warn('⚠️ الاتصال الأولي بالـ Pooler تأخر، سيقوم Prisma بالاتصال تلقائياً عند أول استعلام.');
  }
}

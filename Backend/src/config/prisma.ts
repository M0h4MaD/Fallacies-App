// backend/src/config/prisma.ts (ملف جديد — يلغي db.ts)
// Single shared client — creating more than one exhausts Supabase's free-tier connection cap fast.
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export async function connectDB(): Promise<void> {
  await prisma.$connect()
  console.log('Postgres connected (Prisma)')
}
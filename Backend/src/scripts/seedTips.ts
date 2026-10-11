import 'dotenv/config'
import { prisma } from '../config/prisma.js'
import { tipsDraft } from '../data/tips.seed-data.js'

async function seed() {
  await prisma.tip.deleteMany({ where: { isGenerated: false } })
  for (const draft of tipsDraft) {
    const fallacy = draft.fallacySlug ? await prisma.fallacy.findUnique({ where: { slug: draft.fallacySlug } }) : null
    await prisma.tip.create({ data: { type: draft.type, textAr: draft.textAr, textEn: draft.textEn, fallacyId: fallacy?.id } })
  }
  console.log(`Seeded ${tipsDraft.length} tips.`)
}

seed().catch((err) => { console.error('Tip seeding failed:', err); process.exit(1) }).finally(() => prisma.$disconnect())

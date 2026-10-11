import 'dotenv/config'
import { prisma } from '../config/prisma.js'

async function run() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } })
  const seen = new Set<string>()
  for (const u of users) {
    if (seen.has(u.displayName)) {
      const newName = `${u.displayName}-${u.id.slice(0, 5)}`
      await prisma.user.update({ where: { id: u.id }, data: { displayName: newName } })
      console.log(`Renamed duplicate: ${u.displayName} -> ${newName}`)
    } else seen.add(u.displayName)
  }
}
run().finally(() => prisma.$disconnect())

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config({ path: '.env', override: true })
config({ path: '.env.test.local', override: true })

let prisma: PrismaClient

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL

  prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseURL }),
  })

  execSync('npx prisma migrate deploy', {
    env: {
      ...process.env,
      DATABASE_URL: databaseURL,
    },
  })
})

beforeEach(async () => {
  await prisma.order.deleteMany()
  await prisma.userToken.deleteMany()
  await prisma.user.deleteMany()
  await prisma.broth.deleteMany()
  await prisma.protein.deleteMany()
  await prisma.image.deleteMany()
})

afterAll(async () => {
  if (!prisma) return

  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})

import { execSync } from 'node:child_process'

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { Pool } from 'pg'

config({ path: '.env', override: true })
config({ path: '.env.test.local', override: true })

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

beforeAll(async () => {
  execSync('npx prisma migrate deploy', {
    env: {
      ...process.env,
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
  await prisma.$disconnect()
})

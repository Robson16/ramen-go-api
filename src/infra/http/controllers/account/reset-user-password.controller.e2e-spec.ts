import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Reset Password (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[PATCH] /password/reset', async () => {
    const user = await userFactory.makePrismaUser({
      password: await hash('old_password', 8),
    })

    // Create the token directly in the database to simulate that the user requested recovery.
    const resetToken = await prisma.userToken.create({
      data: {
        userId: user.id.toString(),
        token: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      },
    })

    const response = await request(app.getHttpServer())
      .patch('/password/reset')
      .send({
        token: resetToken.token,
        password: 'new_password_123',
      })

    expect(response.statusCode).toBe(204)

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id.toString() },
    })

    // The password at the bank must have changed and been hashed.
    expect(updatedUser?.password).not.toEqual(user.password)
    expect(updatedUser?.password).not.toEqual('new_password_123')
  })
})

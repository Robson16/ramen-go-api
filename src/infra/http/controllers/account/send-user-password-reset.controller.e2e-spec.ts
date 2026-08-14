import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Send Password Reset (E2E)', () => {
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

  test('[POST] /password/forgot', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@example.com',
    })

    const response = await request(app.getHttpServer())
      .post('/password/forgot')
      .send({
        email: 'johndoe@example.com',
      })

    expect(response.statusCode).toBe(204)

    const tokenOnDb = await prisma.userToken.findFirst({
      where: { userId: user.id.toString() },
    })

    expect(tokenOnDb).toBeTruthy()
  })
})

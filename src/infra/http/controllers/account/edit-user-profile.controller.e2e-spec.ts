import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit User Profile (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /profile - should be able to edit user profile', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'John Doe',
      email: 'john.doe@example.com',
    })
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .put('/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe Updated',
        email: 'john.doe.updated@example.com',
      })

    expect(response.statusCode).toBe(204)

    const userOnDb = await prisma.user.findUnique({
      where: {
        id: user.id.toString(),
      },
    })

    expect(userOnDb).toBeTruthy()
    expect(userOnDb).toEqual(
      expect.objectContaining({
        name: 'John Doe Updated',
        email: 'john.doe.updated@example.com',
      }),
    )
  })

  test('[PUT] /profile - should not be able to edit with an existing email', async () => {
    const user1 = await userFactory.makePrismaUser({
      email: 'user1@example.com',
    })
    const user2 = await userFactory.makePrismaUser({
      email: 'user2@example.com',
    })
    const accessToken = jwt.sign({ sub: user1.id.toString() })

    const response = await request(app.getHttpServer())
      .put('/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: user2.email,
      })

    expect(response.statusCode).toBe(409)
  })
})

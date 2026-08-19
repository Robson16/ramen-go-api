import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('List user (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /admin/users', async () => {
    await Promise.all([
      userFactory.makePrismaUser({
        name: 'Robson',
      }),
      userFactory.makePrismaUser({
        name: 'Henrique',
      }),
      userFactory.makePrismaUser({
        name: 'Rodrigo',
      }),
    ])

    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .get('/admin/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      users: expect.arrayContaining([
        expect.objectContaining({ name: 'Robson' }),
        expect.objectContaining({ name: 'Henrique' }),
        expect.objectContaining({ name: 'Rodrigo' }),
      ]),
    })
  })
})

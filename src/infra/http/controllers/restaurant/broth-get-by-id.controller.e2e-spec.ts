import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'
import { ImageFactory } from 'test/factories/media/image-factory'
import { BrothFactory } from 'test/factories/restaurant/broth-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Get broth by id (e2e)', () => {
  let app: INestApplication
  let imageFactory: ImageFactory
  let brothFactory: BrothFactory
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ImageFactory, BrothFactory, UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    imageFactory = moduleRef.get(ImageFactory)
    brothFactory = moduleRef.get(BrothFactory)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /broths/:brothId', async () => {
    const [imageActive, imageInactive] = await Promise.all([
      imageFactory.makePrismaImage(),
      imageFactory.makePrismaImage(),
    ])

    const broth = await brothFactory.makePrismaBroth({
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    const brothId = broth.id.toString()

    const user = await userFactory.makePrismaUser({ role: 'USER' })
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .get(`/broths/${brothId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        broth: expect.objectContaining({
          id: brothId,
        }),
      }),
    )
  })

  test('[GET] /broths/:brothId - returns not found for a missing broth', async () => {
    const user = await userFactory.makePrismaUser({ role: 'USER' })
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .get('/broths/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  test('[GET] /broths/:brothId - rejects an unauthenticated user', async () => {
    const response = await request(app.getHttpServer()).get(
      '/broths/00000000-0000-0000-0000-000000000000',
    )

    expect(response.statusCode).toBe(401)
  })
})

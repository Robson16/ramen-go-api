import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'
import { ImageFactory } from 'test/factories/media/image-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Image Get By ID (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let imageFactory: ImageFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ImageFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    imageFactory = moduleRef.get(ImageFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /admin/images/:id - admin user', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })
    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const image = await imageFactory.makePrismaImage({
      title: 'test-image.png',
    })

    const response = await request(app.getHttpServer())
      .get(`/admin/images/${image.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.image).toEqual(
      expect.objectContaining({
        title: 'test-image.png',
      }),
    )
  })

  test('[GET] /admin/images/:id - regular user', async () => {
    const user = await userFactory.makePrismaUser({ role: 'USER' })
    const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

    const image = await imageFactory.makePrismaImage()

    const response = await request(app.getHttpServer())
      .get(`/admin/images/${image.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(403)
  })
})

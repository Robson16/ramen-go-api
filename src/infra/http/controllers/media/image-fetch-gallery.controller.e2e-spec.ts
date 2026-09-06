import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'
import { ImageFactory } from 'test/factories/media/image-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Image Fetch Gallery (E2E)', () => {
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

  test('[GET] /admin/images - admin user', async () => {
    const user = await userFactory.makePrismaUser({
      role: 'ADMIN',
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    await Promise.all([
      imageFactory.makePrismaImage({ title: 'Image 01' }),
      imageFactory.makePrismaImage({ title: 'Image 02' }),
    ])

    const response = await request(app.getHttpServer())
      .get('/admin/images')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.images).toHaveLength(2)
    expect(response.body.images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Image 01' }),
        expect.objectContaining({ title: 'Image 02' }),
      ]),
    )
  })

  test('[GET] /admin/images - regular user', async () => {
    const user = await userFactory.makePrismaUser({ role: 'USER' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .get('/admin/images')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(403)
  })
})

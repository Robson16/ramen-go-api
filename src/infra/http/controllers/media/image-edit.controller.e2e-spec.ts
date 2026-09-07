import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'
import { ImageFactory } from 'test/factories/media/image-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Image Edit (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let imageFactory: ImageFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ImageFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    imageFactory = moduleRef.get(ImageFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /admin/images/:id - admin user', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const image = await imageFactory.makePrismaImage({ title: 'old-title.png' })

    const response = await request(app.getHttpServer())
      .patch(`/admin/images/${image.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'new-title.png',
      })

    expect(response.statusCode).toBe(200)

    const imageOnDatabase = await prisma.image.findUnique({
      where: {
        id: image.id.toString(),
      },
    })

    expect(imageOnDatabase?.title).toBe('new-title.png')
  })

  test('[PATCH] /admin/images/:id - regular user', async () => {
    const user = await userFactory.makePrismaUser({ role: 'USER' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const image = await imageFactory.makePrismaImage()

    const response = await request(app.getHttpServer())
      .patch(`/admin/images/${image.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'new-title.png',
      })

    expect(response.statusCode).toBe(403)
  })
})

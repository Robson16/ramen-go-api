import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'
import { ImageFactory } from 'test/factories/media/image-factory'
import { BrothFactory } from 'test/factories/restaurant/broth-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Image Delete (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let imageFactory: ImageFactory
  let brothFactory: BrothFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ImageFactory, BrothFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    imageFactory = moduleRef.get(ImageFactory)
    brothFactory = moduleRef.get(BrothFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /admin/images/:id - admin user', async () => {
    const user = await userFactory.makePrismaUser({
      role: 'ADMIN',
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const image = await imageFactory.makePrismaImage()

    const response = await request(app.getHttpServer())
      .delete(`/admin/images/${image.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const imageOnDatabase = await prisma.image.findUnique({
      where: {
        id: image.id.toString(),
      },
    })

    expect(imageOnDatabase).toBeNull()
  })

  test('[DELETE] /admin/images/:id - regular user', async () => {
    const user = await userFactory.makePrismaUser({ role: 'USER' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const image = await imageFactory.makePrismaImage()

    const response = await request(app.getHttpServer())
      .delete(`/admin/images/${image.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(403)
  })

  test('[DELETE] /admin/images/:id - non-existent image', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .delete('/admin/images/uuid-inexistente')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(400)
  })

  test('[DELETE] /admin/images/:id - image in use', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const image = await imageFactory.makePrismaImage()
    const imageInactive = await imageFactory.makePrismaImage()

    await brothFactory.makePrismaBroth({
      imageActiveId: image.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .delete(`/admin/images/${image.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(409)

    const imageOnDatabase = await prisma.image.findUnique({
      where: { id: image.id.toString() },
    })

    expect(imageOnDatabase).toBeTruthy()
  })
})

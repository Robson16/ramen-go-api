import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'
import { ImageFactory } from 'test/factories/restaurant/image-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create broth (e2e)', () => {
  let app: INestApplication
  let imageFactory: ImageFactory
  let prisma: PrismaService
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ImageFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    imageFactory = moduleRef.get(ImageFactory)
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /admin/broths - admin user', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const imageActive = await imageFactory.makePrismaImage()
    const imageInactive = await imageFactory.makePrismaImage()

    const response = await request(app.getHttpServer())
      .post('/admin/broths')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Salt',
        description: 'Simple like the seawater, nothing more.',
        price: 10,
        imageActiveId: imageActive.id.toString(),
        imageInactiveId: imageInactive.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    const brothOnDatabase = await prisma.broth.findUnique({
      where: {
        name: 'Salt',
      },
    })

    expect(brothOnDatabase).toBeTruthy()
  })

  test('[POST] /admin/broths - regular user', async () => {
    const user = await userFactory.makePrismaUser({ role: 'USER' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const imageActive = await imageFactory.makePrismaImage()
    const imageInactive = await imageFactory.makePrismaImage()

    const response = await request(app.getHttpServer())
      .post('/admin/broths')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Shio',
        description: 'Light and salty broth.',
        price: 10,
        imageActiveId: imageActive.id.toString(),
        imageInactiveId: imageInactive.id.toString(),
      })

    expect(response.statusCode).toBe(403)
  })
})

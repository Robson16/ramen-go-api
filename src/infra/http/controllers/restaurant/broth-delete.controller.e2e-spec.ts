import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'
import { BrothFactory } from 'test/factories/restaurant/broth-factory'
import { ImageFactory } from 'test/factories/restaurant/image-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Delete Broth (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let imageFactory: ImageFactory
  let brothFactory: BrothFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ImageFactory, BrothFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(UserFactory)
    imageFactory = moduleRef.get(ImageFactory)
    brothFactory = moduleRef.get(BrothFactory)

    await app.init()
  })

  test('[DELETE] /admin/broths/:brothId - admin user should be able to delete a broth', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const imageActive = await imageFactory.makePrismaImage()
    const imageInactive = await imageFactory.makePrismaImage()

    const broth = await brothFactory.makePrismaBroth({
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .delete(`/admin/broths/${broth.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const brothOnDatabase = await prisma.broth.findUnique({
      where: {
        id: broth.id.toString(),
      },
    })

    expect(brothOnDatabase).toBeNull()
  })

  test('[DELETE] /admin/broths/:brothId - regular user should not be able to delete a broth', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const imageActive = await imageFactory.makePrismaImage()
    const imageInactive = await imageFactory.makePrismaImage()

    const broth = await brothFactory.makePrismaBroth({
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .delete(`/admin/broths/${broth.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(403)

    const brothOnDatabase = await prisma.broth.findUnique({
      where: {
        id: broth.id.toString(),
      },
    })

    expect(brothOnDatabase).not.toBeNull()
  })

  test('[DELETE] /admin/broths/:brothId - should not be able to delete without authentication', async () => {
    const imageActive = await imageFactory.makePrismaImage()
    const imageInactive = await imageFactory.makePrismaImage()

    const broth = await brothFactory.makePrismaBroth({
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .delete(`/admin/broths/${broth.id.toString()}`)
      .send()

    expect(response.statusCode).toBe(401)

    const brothOnDatabase = await prisma.broth.findUnique({
      where: {
        id: broth.id.toString(),
      },
    })

    expect(brothOnDatabase).not.toBeNull()
  })

  test('[DELETE] /admin/broths/:brothId - should not be able to delete a non-existent broth', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .delete(`/admin/broths/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe('Broth not found.')
  })
})

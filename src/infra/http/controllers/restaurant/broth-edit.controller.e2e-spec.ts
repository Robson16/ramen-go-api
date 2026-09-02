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

describe('Edit broth (e2e)', () => {
  let app: INestApplication
  let brothFactory: BrothFactory
  let imageFactory: ImageFactory
  let prisma: PrismaService
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [BrothFactory, ImageFactory, UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    brothFactory = moduleRef.get(BrothFactory)
    imageFactory = moduleRef.get(ImageFactory)
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /admin/broths/:brothId - admin user should be able to edit a broth', async () => {
    const imageActive = await imageFactory.makePrismaImage()
    const imageInactive = await imageFactory.makePrismaImage()

    const broth = await brothFactory.makePrismaBroth({
      name: 'Original broth',
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .put(`/admin/broths/${broth.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Updated broth',
        description: 'Updated description.',
        price: 15,
      })

    expect(response.statusCode).toBe(204)

    const brothOnDatabase = await prisma.broth.findUnique({
      where: {
        id: broth.id.toString(),
      },
    })

    expect(brothOnDatabase).toBeTruthy()
    expect(brothOnDatabase?.name).toBe('Updated broth')
    expect(brothOnDatabase?.description).toBe('Updated description.')
    expect(brothOnDatabase?.price.toString()).toBe('15')
  })

  test('[PUT] /admin/broths/:brothId - regular user should not be able to edit a broth', async () => {
    const imageActive = await imageFactory.makePrismaImage()
    const imageInactive = await imageFactory.makePrismaImage()

    const broth = await brothFactory.makePrismaBroth({
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    const user = await userFactory.makePrismaUser({ role: 'USER' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .put(`/admin/broths/${broth.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Unauthorized update',
      })

    expect(response.statusCode).toBe(403)
  })

  test('[PUT] /admin/broths/:brothId - should not be able to edit without authentication', async () => {
    const response = await request(app.getHttpServer())
      .put(`/admin/broths/${crypto.randomUUID()}`)
      .send({
        name: 'Unauthorized update',
      })

    expect(response.statusCode).toBe(401)
  })

  test('[PUT] /admin/broths/:brothId - should not be able to edit a non-existent broth', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .put(`/admin/broths/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Missing broth update',
      })

    expect(response.statusCode).toBe(404)
  })

  test('[PUT] /admin/broths/:brothId - should not be able to use an existing name', async () => {
    const firstImageActive = await imageFactory.makePrismaImage()
    const firstImageInactive = await imageFactory.makePrismaImage()
    const secondImageActive = await imageFactory.makePrismaImage()
    const secondImageInactive = await imageFactory.makePrismaImage()

    const existingBroth = await brothFactory.makePrismaBroth({
      name: 'Existing broth',
      imageActiveId: firstImageActive.id.toString(),
      imageInactiveId: firstImageInactive.id.toString(),
    })

    const brothToEdit = await brothFactory.makePrismaBroth({
      imageActiveId: secondImageActive.id.toString(),
      imageInactiveId: secondImageInactive.id.toString(),
    })

    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .put(`/admin/broths/${brothToEdit.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: existingBroth.name,
      })

    expect(response.statusCode).toBe(409)
  })
})

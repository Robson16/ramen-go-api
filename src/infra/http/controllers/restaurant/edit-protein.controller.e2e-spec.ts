import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'
import { ImageFactory } from 'test/factories/restaurant/image-factory'
import { ProteinFactory } from 'test/factories/restaurant/protein-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit protein (e2e)', () => {
  let app: INestApplication
  let imageFactory: ImageFactory
  let prisma: PrismaService
  let proteinFactory: ProteinFactory
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ImageFactory, ProteinFactory, UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    imageFactory = moduleRef.get(ImageFactory)
    prisma = moduleRef.get(PrismaService)
    proteinFactory = moduleRef.get(ProteinFactory)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /proteins/:proteinId - admin user should be able to edit a protein', async () => {
    const imageActive = await imageFactory.makePrismaImage()
    const imageInactive = await imageFactory.makePrismaImage()

    const protein = await proteinFactory.makePrismaProtein({
      name: 'Original protein',
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .put(`/proteins/${protein.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Updated protein',
        description: 'Updated description.',
        price: 15,
      })

    expect(response.statusCode).toBe(204)

    const proteinOnDatabase = await prisma.protein.findUnique({
      where: { id: protein.id.toString() },
    })

    expect(proteinOnDatabase).toBeTruthy()
    expect(proteinOnDatabase?.name).toBe('Updated protein')
    expect(proteinOnDatabase?.description).toBe('Updated description.')
    expect(proteinOnDatabase?.price.toString()).toBe('15')
  })

  test('[PUT] /proteins/:proteinId - regular user should not be able to edit a protein', async () => {
    const imageActive = await imageFactory.makePrismaImage()
    const imageInactive = await imageFactory.makePrismaImage()

    const protein = await proteinFactory.makePrismaProtein({
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    const user = await userFactory.makePrismaUser({ role: 'USER' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .put(`/proteins/${protein.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Unauthorized update',
      })

    expect(response.statusCode).toBe(403)
  })

  test('[PUT] /proteins/:proteinId - should not be able to edit without authentication', async () => {
    const response = await request(app.getHttpServer())
      .put(`/proteins/${crypto.randomUUID()}`)
      .send({
        name: 'Unauthorized update',
      })

    expect(response.statusCode).toBe(401)
  })

  test('[PUT] /proteins/:proteinId - should not be able to edit a non-existent protein', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .put(`/proteins/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Missing protein update',
      })

    expect(response.statusCode).toBe(404)
  })

  test('[PUT] /proteins/:proteinId - should not be able to use an existing name', async () => {
    const firstImageActive = await imageFactory.makePrismaImage()
    const firstImageInactive = await imageFactory.makePrismaImage()
    const secondImageActive = await imageFactory.makePrismaImage()
    const secondImageInactive = await imageFactory.makePrismaImage()

    const existingProtein = await proteinFactory.makePrismaProtein({
      name: 'Existing protein',
      imageActiveId: firstImageActive.id.toString(),
      imageInactiveId: firstImageInactive.id.toString(),
    })

    const proteinToEdit = await proteinFactory.makePrismaProtein({
      imageActiveId: secondImageActive.id.toString(),
      imageInactiveId: secondImageInactive.id.toString(),
    })

    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .put(`/proteins/${proteinToEdit.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: existingProtein.name,
      })

    expect(response.statusCode).toBe(409)
  })
})

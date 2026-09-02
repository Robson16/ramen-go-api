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

describe('Delete Protein (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let imageFactory: ImageFactory
  let proteinFactory: ProteinFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ImageFactory, ProteinFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(UserFactory)
    imageFactory = moduleRef.get(ImageFactory)
    proteinFactory = moduleRef.get(ProteinFactory)

    await app.init()
  })

  test('[DELETE] /admin/proteins/:proteinId - admin user should be able to delete a protein', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const imageActive = await imageFactory.makePrismaImage()
    const imageInactive = await imageFactory.makePrismaImage()

    const protein = await proteinFactory.makePrismaProtein({
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .delete(`/admin/proteins/${protein.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const proteinOnDatabase = await prisma.protein.findUnique({
      where: {
        id: protein.id.toString(),
      },
    })

    expect(proteinOnDatabase).toBeNull()
  })

  test('[DELETE] /admin/proteins/:proteinId - regular user should not be able to delete a protein', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const imageActive = await imageFactory.makePrismaImage()
    const imageInactive = await imageFactory.makePrismaImage()

    const protein = await proteinFactory.makePrismaProtein({
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .delete(`/admin/proteins/${protein.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(403)

    const proteinOnDatabase = await prisma.protein.findUnique({
      where: {
        id: protein.id.toString(),
      },
    })

    expect(proteinOnDatabase).not.toBeNull()
  })

  test('[DELETE] /admin/proteins/:proteinId - should not be able to delete without authentication', async () => {
    const imageActive = await imageFactory.makePrismaImage()
    const imageInactive = await imageFactory.makePrismaImage()

    const protein = await proteinFactory.makePrismaProtein({
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .delete(`/admin/proteins/${protein.id.toString()}`)
      .send()

    expect(response.statusCode).toBe(401)

    const proteinOnDatabase = await prisma.protein.findUnique({
      where: {
        id: protein.id.toString(),
      },
    })

    expect(proteinOnDatabase).not.toBeNull()
  })

  test('[DELETE] /admin/proteins/:proteinId - should not be able to delete a non-existent protein', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .delete(`/admin/proteins/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe('Protein not found.')
  })
})

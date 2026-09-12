import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'
import { ImageFactory } from 'test/factories/media/image-factory'
import { ProteinFactory } from 'test/factories/restaurant/protein-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Get protein by id (e2e)', () => {
  let app: INestApplication
  let imageFactory: ImageFactory
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
    proteinFactory = moduleRef.get(ProteinFactory)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /proteins/:proteinId', async () => {
    const [imageActive, imageInactive] = await Promise.all([
      imageFactory.makePrismaImage(),
      imageFactory.makePrismaImage(),
    ])

    const protein = await proteinFactory.makePrismaProtein({
      imageActiveId: imageActive.id.toString(),
      imageInactiveId: imageInactive.id.toString(),
    })

    const proteinId = protein.id.toString()

    const user = await userFactory.makePrismaUser({ role: 'USER' })
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .get(`/proteins/${proteinId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        protein: expect.objectContaining({
          id: proteinId,
        }),
      }),
    )
  })

  test('[GET] /proteins/:proteinId - returns not found for a missing protein', async () => {
    const user = await userFactory.makePrismaUser({ role: 'USER' })
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .get('/proteins/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  test('[GET] /proteins/:proteinId - rejects an unauthenticated user', async () => {
    const response = await request(app.getHttpServer()).get(
      '/proteins/00000000-0000-0000-0000-000000000000',
    )

    expect(response.statusCode).toBe(401)
  })
})

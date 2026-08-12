import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'
import { ImageFactory } from 'test/factories/restaurant/image-factory'
import { ProteinFactory } from 'test/factories/restaurant/protein-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('List protein (e2e)', () => {
  let app: INestApplication
  let proteinFactory: ProteinFactory
  let imageFactory: ImageFactory
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ProteinFactory, ImageFactory, UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    proteinFactory = moduleRef.get(ProteinFactory)
    imageFactory = moduleRef.get(ImageFactory)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /proteins', async () => {
    const image01Active = await imageFactory.makePrismaImage()
    const image01Inactive = await imageFactory.makePrismaImage()

    const image02Active = await imageFactory.makePrismaImage()
    const image02Inactive = await imageFactory.makePrismaImage()

    await Promise.all([
      proteinFactory.makePrismaProtein({
        name: 'Salt',
        imageActiveId: image01Active.id.toString(),
        imageInactiveId: image01Inactive.id.toString(),
      }),
      proteinFactory.makePrismaProtein({
        name: 'Tonkotsu',
        imageActiveId: image02Active.id.toString(),
        imageInactiveId: image02Inactive.id.toString(),
      }),
    ])

    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/proteins')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      proteins: expect.arrayContaining([
        expect.objectContaining({ name: 'Salt' }),
        expect.objectContaining({ name: 'Tonkotsu' }),
      ]),
    })
  })
})

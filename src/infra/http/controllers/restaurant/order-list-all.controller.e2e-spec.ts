import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'
import { BrothFactory } from 'test/factories/restaurant/broth-factory'
import { ImageFactory } from 'test/factories/restaurant/image-factory'
import { OrderFactory } from 'test/factories/restaurant/order-factory'
import { ProteinFactory } from 'test/factories/restaurant/protein-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('List all orders (e2e)', () => {
  let app: INestApplication
  let imageFactory: ImageFactory
  let brothFactory: BrothFactory
  let proteinFactory: ProteinFactory
  let orderFactory: OrderFactory
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ImageFactory,
        BrothFactory,
        ProteinFactory,
        OrderFactory,
        UserFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    imageFactory = moduleRef.get(ImageFactory)
    brothFactory = moduleRef.get(BrothFactory)
    proteinFactory = moduleRef.get(ProteinFactory)
    orderFactory = moduleRef.get(OrderFactory)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /admin/orders', async () => {
    const user = await userFactory.makePrismaUser({ role: 'ADMIN' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const [imageActive, imageInactive] = await Promise.all([
      imageFactory.makePrismaImage(),
      imageFactory.makePrismaImage(),
    ])

    const [broth, protein] = await Promise.all([
      brothFactory.makePrismaBroth({
        imageActiveId: imageActive.id.toString(),
        imageInactiveId: imageInactive.id.toString(),
      }),
      proteinFactory.makePrismaProtein({
        imageActiveId: imageActive.id.toString(),
        imageInactiveId: imageInactive.id.toString(),
      }),
    ])

    const [firstOrder, secondOrder] = await Promise.all([
      orderFactory.makePrismaOrder({
        userId: user.id,
        brothId: broth.id,
        proteinId: protein.id,
        description: 'First order',
      }),
      orderFactory.makePrismaOrder({
        userId: user.id,
        brothId: broth.id,
        proteinId: protein.id,
        description: 'Second order',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/admin/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({
          id: firstOrder.id.toString(),
          description: 'First order',
          status: 'PENDING',
          createdAt: firstOrder.createdAt.toISOString(),
        }),
        expect.objectContaining({
          id: secondOrder.id.toString(),
          description: 'Second order',
          status: 'PENDING',
          createdAt: secondOrder.createdAt.toISOString(),
        }),
      ]),
    })
  })

  test('[GET] /admin/orders - rejects a regular user', async () => {
    const user = await userFactory.makePrismaUser({ role: 'USER' })
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .get('/admin/orders')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })

  test('[GET] /admin/orders - rejects an unauthenticated user', async () => {
    const response = await request(app.getHttpServer()).get('/admin/orders')

    expect(response.statusCode).toBe(401)
  })
})

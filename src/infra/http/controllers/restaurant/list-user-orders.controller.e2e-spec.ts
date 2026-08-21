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

describe('List user orders (e2e)', () => {
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

  test('[GET] /orders - lists only the authenticated user orders', async () => {
    const user1 = await userFactory.makePrismaUser({ role: 'USER' })
    const user2 = await userFactory.makePrismaUser({ role: 'USER' })

    const accessToken = jwt.sign({
      sub: user1.id.toString(),
      role: user1.role,
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

    const [user1_Order, user2_Order] = await Promise.all([
      orderFactory.makePrismaOrder({
        userId: user1.id,
        brothId: broth.id,
        proteinId: protein.id,
        description: 'User order',
      }),
      orderFactory.makePrismaOrder({
        userId: user2.id,
        brothId: broth.id,
        proteinId: protein.id,
        description: 'Other user order',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      orders: [
        {
          id: user1_Order.id.toString(),
          description: 'User order',
        },
      ],
    })
    expect(response.body.orders).not.toContainEqual({
      id: user2_Order.id.toString(),
      description: 'Other user order',
    })
  })

  test('[GET] /orders - returns an empty list when the user has no orders', async () => {
    const user = await userFactory.makePrismaUser({ role: 'USER' })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ orders: [] })
  })

  test('[GET] /orders - rejects an unauthenticated user', async () => {
    const response = await request(app.getHttpServer()).get('/orders')

    expect(response.statusCode).toBe(401)
  })
})

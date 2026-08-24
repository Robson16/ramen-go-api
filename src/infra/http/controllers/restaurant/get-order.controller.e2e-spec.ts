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

describe('Get order by id (e2e)', () => {
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

  test('[GET] /orders/:orderId', async () => {
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

    const user = await userFactory.makePrismaUser({ role: 'USER' })
    const order = await orderFactory.makePrismaOrder({
      userId: user.id,
      brothId: broth.id,
      proteinId: protein.id,
    })

    const orderId = order.id.toString()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: orderId,
      }),
    )
  })

  test('[GET] /orders/:orderId - denies another regular user', async () => {
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
    const owner = await userFactory.makePrismaUser({ role: 'USER' })
    const otherUser = await userFactory.makePrismaUser({ role: 'USER' })
    const order = await orderFactory.makePrismaOrder({
      userId: owner.id,
      brothId: broth.id,
      proteinId: protein.id,
    })

    const accessToken = jwt.sign({
      sub: otherUser.id.toString(),
      role: otherUser.role,
    })
    const response = await request(app.getHttpServer())
      .get(`/orders/${order.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })

  test('[GET] /orders/:orderId - allows admin user', async () => {
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
    const owner = await userFactory.makePrismaUser({ role: 'USER' })
    const admin = await userFactory.makePrismaUser({ role: 'ADMIN' })
    const order = await orderFactory.makePrismaOrder({
      userId: owner.id,
      brothId: broth.id,
      proteinId: protein.id,
    })

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      role: admin.role,
    })
    const response = await request(app.getHttpServer())
      .get(`/orders/${order.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
  })

  test('[GET] /orders/:orderId - returns not found for a missing order', async () => {
    const user = await userFactory.makePrismaUser({ role: 'USER' })
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const response = await request(app.getHttpServer())
      .get('/orders/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  test('[GET] /orders/:orderId - rejects an unauthenticated user', async () => {
    const response = await request(app.getHttpServer()).get(
      '/orders/00000000-0000-0000-0000-000000000000',
    )

    expect(response.statusCode).toBe(401)
  })
})

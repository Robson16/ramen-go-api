import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/account/user-factory'
import { BrothFactory } from 'test/factories/restaurant/broth-factory'
import { ImageFactory } from 'test/factories/restaurant/image-factory'
import { OrderFactory } from 'test/factories/restaurant/order-factory'
import { ProteinFactory } from 'test/factories/restaurant/protein-factory'

import { OrderProps } from '@/domain/restaurant/enterprise/entities/order'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Update order status (e2e)', () => {
  let app: INestApplication
  let imageFactory: ImageFactory
  let brothFactory: BrothFactory
  let proteinFactory: ProteinFactory
  let orderFactory: OrderFactory
  let userFactory: UserFactory
  let prisma: PrismaService
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
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  async function createOrder(
    userId: OrderProps['userId'],
    status?: 'PENDING' | 'DELIVERED',
  ) {
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

    return orderFactory.makePrismaOrder({
      userId,
      brothId: broth.id,
      proteinId: protein.id,
      status,
    })
  }

  test('[PATCH] /admin/orders/:orderId/status - updates an order status', async () => {
    const admin = await userFactory.makePrismaUser({ role: 'ADMIN' })
    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      role: admin.role,
    })

    const order = await createOrder(admin.id, 'PENDING')

    const response = await request(app.getHttpServer())
      .patch(`/admin/orders/${order.id.toString()}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'PREPARING' })

    expect(response.statusCode).toBe(204)

    const orderOnDatabase = await prisma.order.findUnique({
      where: { id: order.id.toString() },
    })

    expect(orderOnDatabase?.status).toBe('PREPARING')
  })

  test('[PATCH] /admin/orders/:orderId/status - rejects an unauthenticated user', async () => {
    const response = await request(app.getHttpServer())
      .patch('/admin/orders/00000000-0000-0000-0000-000000000000/status')
      .send({ status: 'PREPARING' })

    expect(response.statusCode).toBe(401)
  })

  test('[PATCH] /admin/orders/:orderId/status - rejects a regular user', async () => {
    const user = await userFactory.makePrismaUser({ role: 'USER' })
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    const order = await createOrder(user.id)

    const response = await request(app.getHttpServer())
      .patch(`/admin/orders/${order.id.toString()}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'PREPARING' })

    expect(response.statusCode).toBe(403)
  })

  test('[PATCH] /admin/orders/:orderId/status - rejects an invalid body', async () => {
    const admin = await userFactory.makePrismaUser({ role: 'ADMIN' })
    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      role: admin.role,
    })

    const order = await createOrder(admin.id)

    const response = await request(app.getHttpServer())
      .patch(`/admin/orders/${order.id.toString()}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'INVALID' })

    expect(response.statusCode).toBe(400)
  })

  test('[PATCH] /admin/orders/:orderId/status - returns not found for a missing order', async () => {
    const admin = await userFactory.makePrismaUser({ role: 'ADMIN' })
    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      role: admin.role,
    })

    const response = await request(app.getHttpServer())
      .patch('/admin/orders/00000000-0000-0000-0000-000000000000/status')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'PREPARING' })

    expect(response.statusCode).toBe(404)
  })

  test('[PATCH] /admin/orders/:orderId/status - rejects changing a delivered order', async () => {
    const admin = await userFactory.makePrismaUser({ role: 'ADMIN' })
    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      role: admin.role,
    })

    const order = await createOrder(admin.id, 'DELIVERED')

    const response = await request(app.getHttpServer())
      .patch(`/admin/orders/${order.id.toString()}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'READY' })

    expect(response.statusCode).toBe(409)
  })
})

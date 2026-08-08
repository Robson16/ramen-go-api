import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { BrothFactory } from 'test/factories/broth-factory'
import { ImageFactory } from 'test/factories/image-factory'
import { OrderFactory } from 'test/factories/order-factory'
import { ProteinFactory } from 'test/factories/protein-factory'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { EnvService } from '@/infra/env/env.service'

describe('Get order by id (e2e)', () => {
  let app: INestApplication
  let imageFactory: ImageFactory
  let brothFactory: BrothFactory
  let proteinFactory: ProteinFactory
  let orderFactory: OrderFactory
  let env: EnvService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ImageFactory, BrothFactory, ProteinFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    imageFactory = moduleRef.get(ImageFactory)
    brothFactory = moduleRef.get(BrothFactory)
    proteinFactory = moduleRef.get(ProteinFactory)
    orderFactory = moduleRef.get(OrderFactory)
    env = moduleRef.get(EnvService)

    await app.init()
  })

  test('[GET] /orders/:id', async () => {
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

    const order = await orderFactory.makePrismaOrder({
      brothId: broth.id,
      proteinId: protein.id,
    })

    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set('x-api-key', env.get('API_KEY'))
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual(
      expect.objectContaining({
        id: orderId,
      }),
    )
  })
})

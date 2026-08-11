import { Injectable } from '@nestjs/common'

import {
  Order,
  OrderProps,
} from '@/domain/restaurant/enterprise/entities/order'
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/restaurant/prisma-order-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { makeOrder } from './make-order'

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(data)

    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    })

    return order
  }
}

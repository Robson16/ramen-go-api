import { Injectable } from '@nestjs/common'

import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/restaurant/prisma-order-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order)
  }

  async findMany(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyByUserId(userId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: { createdAt: 'desc' },
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: order.id.toString(),
      },
      data,
    })
  }
}

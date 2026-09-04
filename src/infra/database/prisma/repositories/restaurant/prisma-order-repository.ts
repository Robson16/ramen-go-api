import { Injectable } from '@nestjs/common'

import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/restaurant/prisma-order-mapper'
import { PrismaOrderWithDetailsMapper } from '@/infra/database/prisma/mappers/restaurant/prisma-order-with-details-mapper'
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyByUserId(userId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findByIdWithDetails(id: string): Promise<OrderWithDetails | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        broth: true,
        protein: true,
        user: true,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderWithDetailsMapper.toDomain(order)
  }

  async findManyWithDetails(): Promise<OrderWithDetails[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        broth: true,
        protein: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return orders.map(PrismaOrderWithDetailsMapper.toDomain)
  }

  async findManyByUserIdWithDetails(
    userId: string,
  ): Promise<OrderWithDetails[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        broth: true,
        protein: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return orders.map(PrismaOrderWithDetailsMapper.toDomain)
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

  async count(): Promise<number> {
    return await this.prisma.order.count()
  }
}

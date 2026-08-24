import { Order as PrismaOrder, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/restaurant/enterprise/entities/order'

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        userId: new UniqueEntityID(raw.userId),
        brothId: new UniqueEntityID(raw.brothId),
        proteinId: new UniqueEntityID(raw.proteinId),
        description: raw.description,
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      userId: order.userId.toString(),
      brothId: order.brothId.toString(),
      proteinId: order.proteinId.toString(),
      description: order.description,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt ?? undefined,
    }
  }
}

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Order } from '@/domain/restaurant/enterprise/entities/order';
import { Prisma, Order as PrismaOrder } from '@prisma/client';

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        brothId: new UniqueEntityID(raw.brothId),
        proteinId: new UniqueEntityID(raw.proteinId),
        description: raw.description,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      brothId: order.brothId.toString(),
      proteinId: order.proteinId.toString(),
      description: order.description,
    };
  }
}

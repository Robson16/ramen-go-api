import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository';
import { Order } from '@/domain/restaurant/enterprise/entities/order';
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order-mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return null;
    }

    return PrismaOrderMapper.toDomain(order);
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.create({
      data,
    });
  }
}

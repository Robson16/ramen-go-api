import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository';
import { Order } from '@/domain/restaurant/enterprise/entities/order';

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) {
      return null;
    }

    return order;
  }

  async create(order: Order) {
    this.items.push(order);
  }
}

import { Order } from '@/domain/restaurant/enterprise/entities/order';

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      description: order.description,
    };
  }
}

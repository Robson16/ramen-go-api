import { Order } from '@/domain/restaurant/enterprise/entities/order';

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>;
  abstract create(order: Order): Promise<void>;
}

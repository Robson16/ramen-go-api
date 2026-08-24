import { Order } from '@/domain/restaurant/enterprise/entities/order'

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findMany(): Promise<Order[]>
  abstract findManyByUserId(userId: string): Promise<Order[]>
  abstract create(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
}

import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findMany(): Promise<Order[]>
  abstract findManyByUserId(userId: string): Promise<Order[]>
  abstract findByIdWithDetails(id: string): Promise<OrderWithDetails | null>
  abstract findManyWithDetails(): Promise<OrderWithDetails[]>
  abstract findManyByUserIdWithDetails(
    userId: string,
  ): Promise<OrderWithDetails[]>
  abstract create(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
}

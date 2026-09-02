import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'

export class OrderPresenter {
  static toHTTP(order: OrderWithDetails) {
    return {
      id: order.id.toString(),
      description: order.description,
      status: order.status,
      createdAt: order.createdAt,
      broth: order.broth,
      protein: order.protein,
      user: order.user ? { name: order.user.name } : undefined,
    }
  }
}

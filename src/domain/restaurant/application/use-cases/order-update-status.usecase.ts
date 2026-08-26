import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { OrderAlreadyDeliveredError } from '@/domain/restaurant/enterprise/entities/errors/order-already-delivered-error'
import {
  Order,
  OrderStatus,
} from '@/domain/restaurant/enterprise/entities/order'

interface UpdateOrderStatusUseCaseRequest {
  orderId: string
  newStatus: OrderStatus
}

type UpdateOrderStatusUseCaseResponse = Either<
  ResourceNotFoundError | OrderAlreadyDeliveredError,
  {
    order: Order
  }
>

@Injectable()
export class OrderUpdateStatusUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    newStatus,
  }: UpdateOrderStatusUseCaseRequest): Promise<UpdateOrderStatusUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError('Order not found.'))
    }

    try {
      order.changeStatus(newStatus)
    } catch (error) {
      if (error instanceof OrderAlreadyDeliveredError) {
        return left(error)
      }

      throw error
    }

    await this.ordersRepository.save(order)

    return right({
      order,
    })
  }
}

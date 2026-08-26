import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ForbiddenError } from '@/core/errors/forbidden-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Role } from '@/domain/account/enterprise/entities/user'
import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { Order } from '@/domain/restaurant/enterprise/entities/order'

interface GetOrderByIdUseCaseRequest {
  orderId: string
  userId: string
  role: Role
}

type GetOrderByIdUseCaseResponse = Either<
  ResourceNotFoundError | ForbiddenError,
  {
    order: Order
  }
>

@Injectable()
export class GetOrderByIdUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    userId,
    role,
  }: GetOrderByIdUseCaseRequest): Promise<GetOrderByIdUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError('Order not found.'))
    }

    if (role !== 'ADMIN' && order.userId.toString() !== userId) {
      return left(new ForbiddenError('You cannot access this order.'))
    }

    return right({
      order,
    })
  }
}

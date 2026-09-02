import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UsersRepository } from '@/domain/account/application/repositories/user-repository'
import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'

interface OrderListByUserRequest {
  userId: string
}

type OrderListByUserResponse = Either<
  ResourceNotFoundError,
  {
    orders: OrderWithDetails[]
  }
>

@Injectable()
export class OrderListByUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    userId,
  }: OrderListByUserRequest): Promise<OrderListByUserResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const orders =
      await this.ordersRepository.findManyByUserIdWithDetails(userId)

    return right({
      orders,
    })
  }
}

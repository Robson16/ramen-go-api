import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UsersRepository } from '@/domain/account/application/repositories/user-repository'
import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { Order } from '@/domain/restaurant/enterprise/entities/order'

interface OrderListByUserRequest {
  userId: string
}

type OrderListByUserResponse = Either<
  ResourceNotFoundError,
  {
    orders: Order[]
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

    const orders = await this.ordersRepository.findManyByUserId(userId)

    return right({
      orders,
    })
  }
}

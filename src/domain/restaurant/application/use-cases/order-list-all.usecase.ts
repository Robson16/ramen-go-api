import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { OrdersRepository } from '@/domain/restaurant/application//repositories/order-repository'
import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'

type OrderListUseCaseResponse = Either<
  null,
  {
    orders: OrderWithDetails[]
  }
>

@Injectable()
export class OrderListAllUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(): Promise<OrderListUseCaseResponse> {
    const orders = await this.ordersRepository.findManyWithDetails()

    return right({
      orders,
    })
  }
}

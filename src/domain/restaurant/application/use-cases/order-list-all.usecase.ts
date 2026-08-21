import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { OrdersRepository } from '@/domain/restaurant/application//repositories/order-repository'
import { Order } from '@/domain/restaurant/enterprise/entities/order'

type OrderListUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class OrderListAllUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(): Promise<OrderListUseCaseResponse> {
    const orders = await this.ordersRepository.findMany()

    return right({
      orders,
    })
  }
}

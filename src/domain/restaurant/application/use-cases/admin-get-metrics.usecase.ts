import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository'
import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository'

type AdminGetMetricsUseCaseResponse = Either<
  null,
  {
    totalBroths: number
    totalProteins: number
    totalOrders: number
  }
>

@Injectable()
export class AdminGetMetricsUseCase {
  constructor(
    private brothsRepository: BrothsRepository,
    private proteinsRepository: ProteinsRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute(): Promise<AdminGetMetricsUseCaseResponse> {
    const [totalBroths, totalProteins, totalOrders] = await Promise.all([
      this.brothsRepository.count(),
      this.proteinsRepository.count(),
      this.ordersRepository.count(),
    ])

    return right({
      totalBroths,
      totalProteins,
      totalOrders,
    })
  }
}

import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository'
import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository'
import { Order } from '@/domain/restaurant/enterprise/entities/order'
import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'

interface CreateOrderUseCaseRequest {
  userId: string
  brothId: string
  proteinId: string
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: OrderWithDetails
  }
>

@Injectable()
export class OrderCreateUseCase {
  constructor(
    private brothsRepository: BrothsRepository,
    private proteinsRepository: ProteinsRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    userId,
    brothId,
    proteinId,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const broth = await this.brothsRepository.findById(brothId)

    if (!broth) {
      return left(new ResourceNotFoundError('Broth not found.'))
    }

    const protein = await this.proteinsRepository.findById(proteinId)

    if (!protein) {
      return left(new ResourceNotFoundError('Protein not found.'))
    }

    const order = Order.create({
      userId: new UniqueEntityID(userId),
      brothId: broth.id,
      proteinId: protein.id,
      description: `${broth.name} and ${protein.name} Ramen`,
    })

    await this.ordersRepository.create(order)

    const orderWithDetails = await this.ordersRepository.findByIdWithDetails(
      order.id.toString(),
    )

    if (!orderWithDetails) {
      return left(new ResourceNotFoundError('Order not found.'))
    }

    return right({
      order: orderWithDetails,
    })
  }
}

import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository';
import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository';
import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository';
import { Order } from '@/domain/restaurant/enterprise/entities/order';
import { Injectable } from '@nestjs/common';

interface CreateOrderUseCaseRequest {
  brothId: string;
  proteinId: string;
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order;
  }
>;

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private brothsRepository: BrothsRepository,
    private proteinsRepository: ProteinsRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    brothId,
    proteinId,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const broth = await this.brothsRepository.findById(brothId);

    if (!broth) {
      return left(new ResourceNotFoundError('Broth not found.'));
    }

    const protein = await this.proteinsRepository.findById(proteinId);

    if (!protein) {
      return left(new ResourceNotFoundError('Protein not found.'));
    }

    const order = Order.create({
      brothId: broth.id,
      proteinId: protein.id,
      description: `${broth.name} and ${protein.name} Ramen`,
    });

    await this.ordersRepository.create(order);

    return right({
      order,
    });
  }
}

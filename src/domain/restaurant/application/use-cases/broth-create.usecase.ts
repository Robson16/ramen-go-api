import { Either, left, right } from '@/core/either';
import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository';
import { Broth } from '@/domain/restaurant/enterprise/entities/broth';
import { Injectable } from '@nestjs/common';
import { BrothAlreadyExistsError } from './errors/broth-already-exists-error';

interface CreateBrothUseCaseRequest {
  name: string;
  description: string;
  price: number;
}

type CreateBrothUseCaseResponse = Either<
  BrothAlreadyExistsError,
  {
    broth: Broth;
  }
>;

@Injectable()
export class CreateBrothUseCase {
  constructor(private brothRepository: BrothsRepository) {}

  async execute({
    name,
    description,
    price,
  }: CreateBrothUseCaseRequest): Promise<CreateBrothUseCaseResponse> {
    const nameAlreadyExists = await this.brothRepository.findByName(name);

    if (nameAlreadyExists) {
      return left(new BrothAlreadyExistsError(name));
    }

    const broth = Broth.create({
      name,
      description,
      price,
    });

    await this.brothRepository.create(broth);

    return right({
      broth,
    });
  }
}

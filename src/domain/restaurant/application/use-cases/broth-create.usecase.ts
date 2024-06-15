import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository';
import { ImagesRepository } from '@/domain/restaurant/application/repositories/image-repository';
import { Broth } from '@/domain/restaurant/enterprise/entities/broth';
import { Injectable } from '@nestjs/common';
import { BrothAlreadyExistsError } from './errors/broth-already-exists-error';

interface CreateBrothUseCaseRequest {
  name: string;
  description: string;
  price: number;
  imageActiveId: string;
  imageInactiveId: string;
}

type CreateBrothUseCaseResponse = Either<
  ResourceNotFoundError | BrothAlreadyExistsError,
  {
    broth: Broth;
  }
>;

@Injectable()
export class CreateBrothUseCase {
  constructor(
    private brothsRepository: BrothsRepository,
    private imagesRepository: ImagesRepository,
  ) {}

  async execute({
    name,
    description,
    price,
    imageActiveId,
    imageInactiveId,
  }: CreateBrothUseCaseRequest): Promise<CreateBrothUseCaseResponse> {
    const imageActiveExists =
      await this.imagesRepository.findByID(imageActiveId);

    if (!imageActiveExists) {
      return left(new ResourceNotFoundError('Image (Active) not found.'));
    }

    const imageInactiveExists =
      await this.imagesRepository.findByID(imageInactiveId);

    if (!imageInactiveExists) {
      return left(new ResourceNotFoundError('Image (Inactive) not found.'));
    }

    const nameAlreadyExists = await this.brothsRepository.findByName(name);

    if (nameAlreadyExists) {
      return left(new BrothAlreadyExistsError(name));
    }

    const broth = Broth.create({
      name,
      description,
      price,
      imageActiveId,
      imageInactiveId,
    });

    await this.brothsRepository.create(broth);

    return right({
      broth,
    });
  }
}

import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository';
import { Protein } from '@/domain/restaurant/enterprise/entities/protein';
import { Injectable } from '@nestjs/common';
import { ImagesRepository } from '../repositories/image-repository';
import { ProteinAlreadyExistsError } from './errors/protein-already-exists-error';

interface CreateProteinUseCaseRequest {
  name: string;
  description: string;
  price: number;
  imageActiveId: string;
  imageInactiveId: string;
}

type CreateProteinUseCaseResponse = Either<
  ProteinAlreadyExistsError,
  {
    protein: Protein;
  }
>;

@Injectable()
export class CreateProteinUseCase {
  constructor(
    private proteinRepository: ProteinsRepository,
    private imagesRepository: ImagesRepository,
  ) {}

  async execute({
    name,
    description,
    price,
    imageActiveId,
    imageInactiveId,
  }: CreateProteinUseCaseRequest): Promise<CreateProteinUseCaseResponse> {
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

    const nameAlreadyExists = await this.proteinRepository.findByName(name);

    if (nameAlreadyExists) {
      return left(new ProteinAlreadyExistsError(name));
    }

    const protein = Protein.create({
      name,
      description,
      price,
      imageActiveId,
      imageInactiveId,
    });

    await this.proteinRepository.create(protein);

    return right({
      protein,
    });
  }
}

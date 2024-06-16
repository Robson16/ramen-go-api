import { Either, right } from '@/core/either';
import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository';
import { ProteinWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/protein-with-images-url';
import { Injectable } from '@nestjs/common';

type ListProteinUseCaseResponse = Either<
  null,
  {
    proteins: ProteinWithImagesUrl[];
  }
>;

@Injectable()
export class ListProteinUseCase {
  constructor(private proteinsRepository: ProteinsRepository) {}

  async execute(): Promise<ListProteinUseCaseResponse> {
    const proteins = await this.proteinsRepository.findManyWithImagesUrl();

    return right({
      proteins,
    });
  }
}

import { Either, right } from '@/core/either';
import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository';
import { BrothWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/broth-with-images-url';
import { Injectable } from '@nestjs/common';

type ListBrothUseCaseResponse = Either<
  null,
  {
    broths: BrothWithImagesUrl[];
  }
>;

@Injectable()
export class ListBrothUseCase {
  constructor(private brothsRepository: BrothsRepository) {}

  async execute(): Promise<ListBrothUseCaseResponse> {
    const broths = await this.brothsRepository.findManyWithImagesUrl();

    return right({
      broths,
    });
  }
}

import { Either, right } from '@/core/either';
import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository';
import { Injectable } from '@nestjs/common';
import { BrothWithImagesUrl } from '../../enterprise/entities/value-objects/broth-with-images-url';

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

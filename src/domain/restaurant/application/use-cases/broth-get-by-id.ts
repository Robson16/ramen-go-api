import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository'
import { BrothWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/broth-with-images-url'

interface BrothGetByIdUseCaseRequest {
  brothId: string
}

type BrothGetByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    broth: BrothWithImagesUrl
  }
>

@Injectable()
export class BrothGetByIdUseCase {
  constructor(private brothsRepository: BrothsRepository) {}

  async execute({
    brothId,
  }: BrothGetByIdUseCaseRequest): Promise<BrothGetByIdUseCaseResponse> {
    const broth = await this.brothsRepository.findByIdWithImagesUrl(brothId)

    if (!broth) {
      return left(new ResourceNotFoundError('Broth not found.'))
    }

    return right({
      broth,
    })
  }
}

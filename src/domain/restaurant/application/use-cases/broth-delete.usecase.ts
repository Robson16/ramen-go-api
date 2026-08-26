import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository'

interface DeleteBrothUseCaseRequest {
  brothId: string
}

type DeleteBrothUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class BrothDeleteUseCase {
  constructor(private brothsRepository: BrothsRepository) {}

  async execute({
    brothId,
  }: DeleteBrothUseCaseRequest): Promise<DeleteBrothUseCaseResponse> {
    const broth = await this.brothsRepository.findById(brothId)

    if (!broth) {
      return left(new ResourceNotFoundError('Broth not found.'))
    }

    await this.brothsRepository.delete(broth)

    return right(null)
  }
}

import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository'
import { ProteinWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/protein-with-images-url'

interface ProteinGetByIdUseCaseRequest {
  proteinId: string
}

type ProteinGetByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    protein: ProteinWithImagesUrl
  }
>

@Injectable()
export class ProteinGetByIdUseCase {
  constructor(private proteinsRepository: ProteinsRepository) {}

  async execute({
    proteinId,
  }: ProteinGetByIdUseCaseRequest): Promise<ProteinGetByIdUseCaseResponse> {
    const protein =
      await this.proteinsRepository.findByIdWithImagesUrl(proteinId)

    if (!protein) {
      return left(new ResourceNotFoundError('Protein not found.'))
    }

    return right({
      protein,
    })
  }
}

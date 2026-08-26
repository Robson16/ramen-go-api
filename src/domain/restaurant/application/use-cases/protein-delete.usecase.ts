import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository'

interface DeleteProteinUseCaseRequest {
  proteinId: string
}

type DeleteProteinUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteProteinUseCase {
  constructor(private proteinsRepository: ProteinsRepository) {}

  async execute({
    proteinId,
  }: DeleteProteinUseCaseRequest): Promise<DeleteProteinUseCaseResponse> {
    const protein = await this.proteinsRepository.findById(proteinId)

    if (!protein) {
      return left(new ResourceNotFoundError('Protein not found.'))
    }

    await this.proteinsRepository.delete(protein)

    return right(null)
  }
}

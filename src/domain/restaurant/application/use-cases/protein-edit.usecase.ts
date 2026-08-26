import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ImagesRepository } from '@/domain/restaurant/application/repositories/image-repository'
import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository'
import { Protein } from '@/domain/restaurant/enterprise/entities/protein'

import { ProteinAlreadyExistsError } from './errors/protein-already-exists-error'

interface EditProteinUseCaseRequest {
  proteinId: string
  name?: string
  description?: string
  price?: number
  imageActiveId?: string
  imageInactiveId?: string
}

type EditProteinUseCaseResponse = Either<
  ResourceNotFoundError | ProteinAlreadyExistsError,
  {
    protein: Protein
  }
>

@Injectable()
export class ProteinEditUseCase {
  constructor(
    private proteinsRepository: ProteinsRepository,
    private imagesRepository: ImagesRepository,
  ) {}

  async execute({
    proteinId,
    name,
    description,
    price,
    imageActiveId,
    imageInactiveId,
  }: EditProteinUseCaseRequest): Promise<EditProteinUseCaseResponse> {
    const protein = await this.proteinsRepository.findById(proteinId)

    if (!protein) {
      return left(new ResourceNotFoundError('Protein not found.'))
    }

    if (imageActiveId && imageActiveId !== protein.imageActiveId) {
      const imageActiveExists =
        await this.imagesRepository.findByID(imageActiveId)

      if (!imageActiveExists) {
        return left(new ResourceNotFoundError('Image (Active) not found.'))
      }

      protein.imageActiveId = imageActiveId
    }

    if (imageInactiveId && imageInactiveId !== protein.imageInactiveId) {
      const imageInactiveExists =
        await this.imagesRepository.findByID(imageInactiveId)

      if (!imageInactiveExists) {
        return left(new ResourceNotFoundError('Image (Inactive) not found.'))
      }

      protein.imageInactiveId = imageInactiveId
    }

    if (name && name !== protein.name) {
      const nameAlreadyExists = await this.proteinsRepository.findByName(name)

      if (nameAlreadyExists) {
        return left(new ProteinAlreadyExistsError(name))
      }

      protein.name = name
    }

    if (description !== undefined) {
      protein.description = description
    }

    if (price !== undefined) {
      protein.price = price
    }

    await this.proteinsRepository.save(protein)

    return right({
      protein,
    })
  }
}

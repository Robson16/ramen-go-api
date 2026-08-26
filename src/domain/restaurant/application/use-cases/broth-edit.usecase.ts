import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository'
import { ImagesRepository } from '@/domain/restaurant/application/repositories/image-repository'
import { Broth } from '@/domain/restaurant/enterprise/entities/broth'

import { BrothAlreadyExistsError } from './errors/broth-already-exists-error'

interface EditBrothUseCaseRequest {
  brothId: string
  name?: string
  description?: string
  price?: number
  imageActiveId?: string
  imageInactiveId?: string
}

type EditBrothUseCaseResponse = Either<
  ResourceNotFoundError | BrothAlreadyExistsError,
  {
    broth: Broth
  }
>

@Injectable()
export class BrothEditUseCase {
  constructor(
    private brothsRepository: BrothsRepository,
    private imagesRepository: ImagesRepository,
  ) {}

  async execute({
    brothId,
    name,
    description,
    price,
    imageActiveId,
    imageInactiveId,
  }: EditBrothUseCaseRequest): Promise<EditBrothUseCaseResponse> {
    const broth = await this.brothsRepository.findById(brothId)

    if (!broth) {
      return left(new ResourceNotFoundError('Broth not found.'))
    }

    if (imageActiveId && imageActiveId !== broth.imageActiveId) {
      const imageActiveExists =
        await this.imagesRepository.findByID(imageActiveId)

      if (!imageActiveExists) {
        return left(new ResourceNotFoundError('Image (Active) not found.'))
      }

      broth.imageActiveId = imageActiveId
    }

    if (imageInactiveId && imageInactiveId !== broth.imageInactiveId) {
      const imageInactiveExists =
        await this.imagesRepository.findByID(imageInactiveId)

      if (!imageInactiveExists) {
        return left(new ResourceNotFoundError('Image (Inactive) not found.'))
      }

      broth.imageInactiveId = imageInactiveId
    }

    if (name && name !== broth.name) {
      const nameAlreadyExists = await this.brothsRepository.findByName(name)

      if (nameAlreadyExists) {
        return left(new BrothAlreadyExistsError(name))
      }

      broth.name = name
    }

    if (description !== undefined) {
      broth.description = description
    }

    if (price !== undefined) {
      broth.price = price
    }

    await this.brothsRepository.save(broth)

    return right({
      broth,
    })
  }
}

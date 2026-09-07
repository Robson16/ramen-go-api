import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ImagesRepository } from '@/domain/media/application/repositories/image-repository'
import { Image } from '@/domain/media/enterprise/entities/image'

interface ImageGetByIdUseCaseRequest {
  imageId: string
}

type ImageGetByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    image: Image
  }
>

@Injectable()
export class ImageGetByIdUseCase {
  constructor(private imagesRepository: ImagesRepository) {}

  async execute({
    imageId,
  }: ImageGetByIdUseCaseRequest): Promise<ImageGetByIdUseCaseResponse> {
    const image = await this.imagesRepository.findByID(imageId)

    if (!image) {
      return left(new ResourceNotFoundError('Image not found.'))
    }

    return right({
      image,
    })
  }
}

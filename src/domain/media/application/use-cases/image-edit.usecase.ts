import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ImagesRepository } from '@/domain/media/application/repositories/image-repository'
import { Image } from '@/domain/media/enterprise/entities/image'

interface ImageEditUseCaseRequest {
  imageId: string
  title: string
}

type ImageEditUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    image: Image
  }
>

@Injectable()
export class ImageEditUseCase {
  constructor(private imagesRepository: ImagesRepository) {}

  async execute({
    imageId,
    title,
  }: ImageEditUseCaseRequest): Promise<ImageEditUseCaseResponse> {
    const image = await this.imagesRepository.findByID(imageId)

    if (!image) {
      return left(new ResourceNotFoundError('Image not found.'))
    }

    image.title = title

    await this.imagesRepository.save(image)

    return right({
      image,
    })
  }
}

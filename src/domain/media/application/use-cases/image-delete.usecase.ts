import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceInUseError } from '@/core/errors/resource-in-use-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ImagesRepository } from '@/domain/media/application/repositories/image-repository'
import { StorageProvider } from '@/domain/media/application/storage/storage-provider'

interface ImageDeleteUseCaseRequest {
  imageId: string
}

type ImageDeleteUseCaseResponse = Either<
  ResourceNotFoundError | ResourceInUseError,
  null
>

@Injectable()
export class ImageDeleteUseCase {
  constructor(
    private imagesRepository: ImagesRepository,
    private storageProvider: StorageProvider,
  ) {}

  async execute({
    imageId,
  }: ImageDeleteUseCaseRequest): Promise<ImageDeleteUseCaseResponse> {
    const image = await this.imagesRepository.findByID(imageId)

    if (!image) {
      return left(new ResourceNotFoundError('Image not found.'))
    }

    try {
      await this.imagesRepository.delete(image)

      await this.storageProvider.delete(image.url)

      return right(null)
    } catch (error) {
      if (error instanceof ResourceInUseError) {
        return left(error)
      }

      throw error
    }
  }
}

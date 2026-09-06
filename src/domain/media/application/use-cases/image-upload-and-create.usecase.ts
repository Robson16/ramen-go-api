import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ImagesRepository } from '@/domain/media/application/repositories/image-repository'
import { StorageProvider } from '@/domain/media/application/storage/storage-provider'
import { Image } from '@/domain/media/enterprise/entities/image'

import { InvalidImageTypeError } from './errors/invalid-image-type-error'

interface UploadAndCreateImageUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateImageUseCaseResponse = Either<
  InvalidImageTypeError,
  {
    image: Image
  }
>

@Injectable()
export class ImageUploadAndCreateUseCase {
  constructor(
    private imagesRepository: ImagesRepository,
    private storageProvider: StorageProvider,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateImageUseCaseRequest): Promise<UploadAndCreateImageUseCaseResponse> {
    if (!/^image\/(jpeg|png|svg\+xml)$/.test(fileType)) {
      return left(new InvalidImageTypeError(fileType))
    }

    const { url } = await this.storageProvider.upload({
      fileName,
      fileType,
      body,
    })

    const image = Image.create({
      title: fileName,
      url,
    })

    await this.imagesRepository.create(image)

    return right({
      image,
    })
  }
}

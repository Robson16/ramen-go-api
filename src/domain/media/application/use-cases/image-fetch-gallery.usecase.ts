import { Either, right } from '@/core/either'
import { ImagesRepository } from '@/domain/media/application/repositories/image-repository'
import { Image } from '@/domain/media/enterprise/entities/image'

interface ImageFetchGalleryUseCaseRequest {
  page?: number
}

type ImageFetchGalleryUseCaseResponse = Either<
  null,
  {
    images: Image[]
  }
>

export class ImageFetchGalleryUseCase {
  constructor(private imagesRepository: ImagesRepository) {}

  async execute({
    page = 1,
  }: ImageFetchGalleryUseCaseRequest): Promise<ImageFetchGalleryUseCaseResponse> {
    const images = await this.imagesRepository.findMany(page)

    return right({
      images,
    })
  }
}

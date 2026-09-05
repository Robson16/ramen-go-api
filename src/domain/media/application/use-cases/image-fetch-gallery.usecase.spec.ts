import { makeImage } from 'test/factories/media/make-image'
import { InMemoryImagesRepository } from 'test/repositories/media/in-memory-image-repository'

import { ImageFetchGalleryUseCase } from './image-fetch-gallery.usecase'

let inMemoryImagesRepository: InMemoryImagesRepository
let sut: ImageFetchGalleryUseCase // Subject Under Test

describe('Fetch image gallery', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    sut = new ImageFetchGalleryUseCase(inMemoryImagesRepository)
  })

  it('should be able to fetch the gallery images', async () => {
    const firstImage = makeImage()
    const secondImage = makeImage()

    await inMemoryImagesRepository.create(firstImage)
    await inMemoryImagesRepository.create(secondImage)

    const result = await sut.execute({ page: 1 })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      images: [firstImage, secondImage],
    })
  })

  it('should use page 1 as default when no page is informed', async () => {
    const firstImage = makeImage()
    const secondImage = makeImage()

    await inMemoryImagesRepository.create(firstImage)
    await inMemoryImagesRepository.create(secondImage)

    const result = await sut.execute({})

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      images: [firstImage, secondImage],
    })
  })
})

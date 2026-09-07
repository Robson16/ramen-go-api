import { makeImage } from 'test/factories/media/make-image'
import { InMemoryImagesRepository } from 'test/repositories/media/in-memory-image-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { ImageGetByIdUseCase } from './image-get-by-id.usecase'

let inMemoryImagesRepository: InMemoryImagesRepository
let sut: ImageGetByIdUseCase

describe('Get Image By ID', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    sut = new ImageGetByIdUseCase(inMemoryImagesRepository)
  })

  it('should be able to get an image by id', async () => {
    const newImage = makeImage({ title: 'icon.png' })
    await inMemoryImagesRepository.create(newImage)

    const result = await sut.execute({
      imageId: newImage.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.image.title).toBe('icon.png')
    }
  })

  it('should not be able to get an image with wrong id', async () => {
    const result = await sut.execute({
      imageId: 'non-existing-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

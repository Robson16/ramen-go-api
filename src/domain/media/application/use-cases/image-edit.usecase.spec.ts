import { makeImage } from 'test/factories/media/make-image'
import { InMemoryImagesRepository } from 'test/repositories/media/in-memory-image-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { ImageEditUseCase } from './image-edit.usecase'

let inMemoryImagesRepository: InMemoryImagesRepository
let sut: ImageEditUseCase

describe('Edit Image', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    sut = new ImageEditUseCase(inMemoryImagesRepository)
  })

  it('should be able to edit an image title', async () => {
    const newImage = makeImage({ title: 'old-title.png' })
    await inMemoryImagesRepository.create(newImage)

    const result = await sut.execute({
      imageId: newImage.id.toString(),
      title: 'new-title.png',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.image.title).toBe('new-title.png')
      expect(inMemoryImagesRepository.items[0].title).toBe('new-title.png')
    }
  })

  it('should not be able to edit an image with wrong id', async () => {
    const result = await sut.execute({
      imageId: 'non-existing-id',
      title: 'new-title.png',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

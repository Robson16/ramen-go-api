import { makeImage } from 'test/factories/media/make-image'
import { InMemoryImagesRepository } from 'test/repositories/media/in-memory-image-repository'
import { FakeStorageProvider } from 'test/storage/fake-storage-provider'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { ImageDeleteUseCase } from './image-delete.usecase'

let inMemoryImagesRepository: InMemoryImagesRepository
let fakeStorageProvider: FakeStorageProvider
let sut: ImageDeleteUseCase

describe('Delete image', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    fakeStorageProvider = new FakeStorageProvider()
    sut = new ImageDeleteUseCase(inMemoryImagesRepository, fakeStorageProvider)
  })

  it('should be able to delete an image', async () => {
    const image = makeImage()

    await inMemoryImagesRepository.create(image)

    const result = await sut.execute({
      imageId: image.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(inMemoryImagesRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a non-existent image', async () => {
    const result = await sut.execute({
      imageId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

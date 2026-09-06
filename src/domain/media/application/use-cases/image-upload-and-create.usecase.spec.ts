import { InMemoryImagesRepository } from 'test/repositories/media/in-memory-image-repository'
import { FakeStorageProvider } from 'test/storage/fake-storage-provider'

import { InvalidImageTypeError } from './errors/invalid-image-type-error'
import { ImageUploadAndCreateUseCase } from './image-upload-and-create.usecase'

let inMemoryImagesRepository: InMemoryImagesRepository
let fakeStorageProvider: FakeStorageProvider
let sut: ImageUploadAndCreateUseCase // Subject Under Test

describe('Upload and create image', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    fakeStorageProvider = new FakeStorageProvider()
    sut = new ImageUploadAndCreateUseCase(
      inMemoryImagesRepository,
      fakeStorageProvider,
    )
  })

  it('should be able to upload and create an image', async () => {
    const result = await sut.execute({
      fileName: 'icon.svg',
      fileType: 'image/svg+xml',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      image: inMemoryImagesRepository.items[0],
    })
    expect(fakeStorageProvider.items).toHaveLength(1)
    expect(fakeStorageProvider.items[0]).toEqual(
      expect.objectContaining({
        fileName: 'icon.svg',
      }),
    )
  })

  it('should not be able to upload an attachment with a non allowed file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidImageTypeError)
  })
})

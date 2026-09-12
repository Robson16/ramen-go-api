import { makeImage } from 'test/factories/media/make-image'
import { makeBroth } from 'test/factories/restaurant/make-broth'
import { InMemoryImagesRepository } from 'test/repositories/media/in-memory-image-repository'
import { InMemoryBrothsRepository } from 'test/repositories/restaurant/in-memory-broth-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { BrothGetByIdUseCase } from './broth-get-by-id'

let inMemoryBrothsRepository: InMemoryBrothsRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let sut: BrothGetByIdUseCase // SUT = Subject Under Test

describe('Get Broth By Id Use Case', () => {
  beforeEach(async () => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryBrothsRepository = new InMemoryBrothsRepository(
      inMemoryImagesRepository,
    )
    sut = new BrothGetByIdUseCase(inMemoryBrothsRepository)
  })

  it('should be able to get a broth by id', async () => {
    const imageActive = makeImage()
    const imageInactive = makeImage()

    await inMemoryImagesRepository.create(imageActive)
    await inMemoryImagesRepository.create(imageInactive)

    await inMemoryBrothsRepository.create(
      makeBroth(
        {
          imageActiveId: imageActive.id.toString(),
          imageInactiveId: imageInactive.id.toString(),
        },
        new UniqueEntityID('broth-1'),
      ),
    )

    const result = await sut.execute({
      brothId: 'broth-1',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.broth.id.toString()).toEqual('broth-1')
      expect(result.value.broth.imageActive).toEqual(imageActive)
      expect(result.value.broth.imageInactive).toEqual(imageInactive)
    }
  })

  it('should not be able to get an broth with wrong id', async () => {
    const result = await sut.execute({
      brothId: 'non-existing-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

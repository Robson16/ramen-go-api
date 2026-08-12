import { makeBroth } from 'test/factories/restaurant/make-broth'
import { makeImage } from 'test/factories/restaurant/make-image'
import { InMemoryBrothsRepository } from 'test/repositories/restaurant/in-memory-broth-repository'
import { InMemoryImagesRepository } from 'test/repositories/restaurant/in-memory-image-repository'

import { ListBrothUseCase } from './broth-list.usecase'

let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryBrothsRepository: InMemoryBrothsRepository
let sut: ListBrothUseCase // Subject Under Test

describe('List Broth', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryBrothsRepository = new InMemoryBrothsRepository(
      inMemoryImagesRepository,
    )
    sut = new ListBrothUseCase(inMemoryBrothsRepository)
  })

  it('should be able to list broths', async () => {
    for (let i = 1; i <= 10; i++) {
      const imageActive = makeImage()
      const imageInactive = makeImage()

      await inMemoryImagesRepository.create(imageActive)
      await inMemoryImagesRepository.create(imageInactive)

      await inMemoryBrothsRepository.create(
        makeBroth({
          imageActiveId: imageActive.id.toString(),
          imageInactiveId: imageInactive.id.toString(),
        }),
      )
    }

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(inMemoryBrothsRepository.items).toHaveLength(10)
  })
})

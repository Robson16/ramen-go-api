import { makeBroth } from 'test/factories/restaurant/make-broth'
import { InMemoryBrothsRepository } from 'test/repositories/restaurant/in-memory-broth-repository'
import { InMemoryImagesRepository } from 'test/repositories/restaurant/in-memory-image-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { BrothDeleteUseCase } from './broth-delete.usecase'

let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryBrothsRepository: InMemoryBrothsRepository
let sut: BrothDeleteUseCase // Subject Under Test

describe('Delete Broth Use Case', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryBrothsRepository = new InMemoryBrothsRepository(
      inMemoryImagesRepository,
    )
    sut = new BrothDeleteUseCase(inMemoryBrothsRepository)
  })

  it('should be able to delete a broth', async () => {
    const broth = makeBroth()

    await inMemoryBrothsRepository.create(broth)

    const result = await sut.execute({
      brothId: broth.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryBrothsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a non-existent broth', async () => {
    const result = await sut.execute({
      brothId: 'non-existent-broth-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

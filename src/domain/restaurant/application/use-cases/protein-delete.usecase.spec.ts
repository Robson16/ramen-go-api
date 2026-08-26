import { makeProtein } from 'test/factories/restaurant/make-protein'
import { InMemoryImagesRepository } from 'test/repositories/restaurant/in-memory-image-repository'
import { InMemoryProteinsRepository } from 'test/repositories/restaurant/in-memory-protein-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { ProteinDeleteUseCase } from './protein-delete.usecase'

let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryProteinsRepository: InMemoryProteinsRepository
let sut: ProteinDeleteUseCase // Subject Under Test

describe('Delete Protein Use Case', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryProteinsRepository = new InMemoryProteinsRepository(
      inMemoryImagesRepository,
    )
    sut = new ProteinDeleteUseCase(inMemoryProteinsRepository)
  })

  it('should be able to delete a protein', async () => {
    const protein = makeProtein()

    await inMemoryProteinsRepository.create(protein)

    const result = await sut.execute({
      proteinId: protein.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProteinsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a non-existent protein', async () => {
    const result = await sut.execute({
      proteinId: 'non-existent-protein-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

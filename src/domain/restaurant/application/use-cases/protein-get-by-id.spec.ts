import { makeImage } from 'test/factories/media/make-image'
import { makeProtein } from 'test/factories/restaurant/make-protein'
import { InMemoryImagesRepository } from 'test/repositories/media/in-memory-image-repository'
import { InMemoryProteinsRepository } from 'test/repositories/restaurant/in-memory-protein-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { ProteinGetByIdUseCase } from './protein-get-by-id'

let inMemoryProteinsRepository: InMemoryProteinsRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let sut: ProteinGetByIdUseCase // SUT = Subject Under Test

describe('Get Protein By Id Use Case', () => {
  beforeEach(async () => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryProteinsRepository = new InMemoryProteinsRepository(
      inMemoryImagesRepository,
    )
    sut = new ProteinGetByIdUseCase(inMemoryProteinsRepository)
  })

  it('should be able to get a protein by id', async () => {
    const imageActive = makeImage()
    const imageInactive = makeImage()

    await inMemoryImagesRepository.create(imageActive)
    await inMemoryImagesRepository.create(imageInactive)

    await inMemoryProteinsRepository.create(
      makeProtein(
        {
          imageActiveId: imageActive.id.toString(),
          imageInactiveId: imageInactive.id.toString(),
        },
        new UniqueEntityID('protein-1'),
      ),
    )

    const result = await sut.execute({
      proteinId: 'protein-1',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.protein.id.toString()).toEqual('protein-1')
      expect(result.value.protein.imageActive).toEqual(imageActive)
      expect(result.value.protein.imageInactive).toEqual(imageInactive)
    }
  })

  it('should not be able to get an protein with wrong id', async () => {
    const result = await sut.execute({
      proteinId: 'non-existing-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

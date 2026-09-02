import { makeBroth } from 'test/factories/restaurant/make-broth'
import { makeProtein } from 'test/factories/restaurant/make-protein'
import { InMemoryBrothsRepository } from 'test/repositories/restaurant/in-memory-broth-repository'
import { InMemoryImagesRepository } from 'test/repositories/restaurant/in-memory-image-repository'
import { InMemoryOrdersRepository } from 'test/repositories/restaurant/in-memory-order-repository'
import { InMemoryProteinsRepository } from 'test/repositories/restaurant/in-memory-protein-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { OrderCreateUseCase } from './order-create.usecase'

let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryBrothsRepository: InMemoryBrothsRepository
let inMemoryProteinsRepository: InMemoryProteinsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: OrderCreateUseCase // Subject Under Test

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryBrothsRepository = new InMemoryBrothsRepository(
      inMemoryImagesRepository,
    )
    inMemoryProteinsRepository = new InMemoryProteinsRepository(
      inMemoryImagesRepository,
    )
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryBrothsRepository,
      inMemoryProteinsRepository,
    )
    sut = new OrderCreateUseCase(
      inMemoryBrothsRepository,
      inMemoryProteinsRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to create a order', async () => {
    const broth = makeBroth()
    const protein = makeProtein()

    await Promise.all([
      inMemoryBrothsRepository.create(broth),
      inMemoryProteinsRepository.create(protein),
    ])

    const result = await sut.execute({
      userId: 'user-1',
      brothId: broth.id.toString(),
      proteinId: protein.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.order).toEqual(
        expect.objectContaining({
          id: inMemoryOrdersRepository.items[0].id,
          description: `${broth.name} and ${protein.name} Ramen`,
          status: 'PENDING',
          broth: { name: broth.name },
          protein: { name: protein.name },
        }),
      )
      expect(result.value.order.userId.toString()).toEqual('user-1')
    }
  })

  it('should not be able to create a order without broth', async () => {
    const protein = makeProtein()

    await inMemoryProteinsRepository.create(protein)

    const result = await sut.execute({
      brothId: 'undefined-broth-id',
      proteinId: protein.id.toString(),
      userId: 'user-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a order without protein', async () => {
    const broth = makeBroth()

    await inMemoryBrothsRepository.create(broth)

    const result = await sut.execute({
      brothId: broth.id.toString(),
      proteinId: 'undefined-protein-id',
      userId: 'user-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

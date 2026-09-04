import { makeBroth } from 'test/factories/restaurant/make-broth'
import { makeOrder } from 'test/factories/restaurant/make-order'
import { makeProtein } from 'test/factories/restaurant/make-protein'
import { InMemoryBrothsRepository } from 'test/repositories/restaurant/in-memory-broth-repository'
import { InMemoryImagesRepository } from 'test/repositories/restaurant/in-memory-image-repository'
import { InMemoryOrdersRepository } from 'test/repositories/restaurant/in-memory-order-repository'
import { InMemoryProteinsRepository } from 'test/repositories/restaurant/in-memory-protein-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { OrderListAllUseCase } from './order-list-all.usecase'

let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryBrothsRepository: InMemoryBrothsRepository
let inMemoryProteinsRepository: InMemoryProteinsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: OrderListAllUseCase // Subject Under Test

describe('List Order', () => {
  beforeEach(async () => {
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
    sut = new OrderListAllUseCase(inMemoryOrdersRepository)
  })

  it('should be able to list orders', async () => {
    await inMemoryBrothsRepository.create(
      makeBroth({}, new UniqueEntityID('broth-1')),
    )
    await inMemoryProteinsRepository.create(
      makeProtein({}, new UniqueEntityID('protein-1')),
    )

    for (let i = 1; i <= 10; i++) {
      await inMemoryOrdersRepository.create(
        makeOrder({
          brothId: new UniqueEntityID('broth-1'),
          proteinId: new UniqueEntityID('protein-1'),
        }),
      )
    }

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items).toHaveLength(10)
  })
})

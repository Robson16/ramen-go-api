import { makeBroth } from 'test/factories/restaurant/make-broth'
import { makeOrder } from 'test/factories/restaurant/make-order'
import { makeProtein } from 'test/factories/restaurant/make-protein'
import { InMemoryUsersRepository } from 'test/repositories/account/in-memory-user-repository'
import { InMemoryBrothsRepository } from 'test/repositories/restaurant/in-memory-broth-repository'
import { InMemoryImagesRepository } from 'test/repositories/restaurant/in-memory-image-repository'
import { InMemoryOrdersRepository } from 'test/repositories/restaurant/in-memory-order-repository'
import { InMemoryProteinsRepository } from 'test/repositories/restaurant/in-memory-protein-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AdminGetMetricsUseCase } from './admin-get-metrics.usecase'

let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryBrothsRepository: InMemoryBrothsRepository
let inMemoryProteinsRepository: InMemoryProteinsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: AdminGetMetricsUseCase // Subject Under Test

describe('Admin Get Metrics Use Case', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryBrothsRepository = new InMemoryBrothsRepository(
      inMemoryImagesRepository,
    )
    inMemoryProteinsRepository = new InMemoryProteinsRepository(
      inMemoryImagesRepository,
    )
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryBrothsRepository,
      inMemoryProteinsRepository,
      inMemoryUsersRepository,
    )
    sut = new AdminGetMetricsUseCase(
      inMemoryBrothsRepository,
      inMemoryProteinsRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to get admin metrics', async () => {
    await inMemoryBrothsRepository.create(
      makeBroth({}, new UniqueEntityID('broth-1')),
    )
    await inMemoryBrothsRepository.create(
      makeBroth({}, new UniqueEntityID('broth-2')),
    )

    await inMemoryProteinsRepository.create(
      makeProtein({}, new UniqueEntityID('protein-1')),
    )

    await inMemoryOrdersRepository.create(
      makeOrder({
        brothId: new UniqueEntityID('broth-1'),
        proteinId: new UniqueEntityID('protein-1'),
      }),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({
        brothId: new UniqueEntityID('broth-2'),
        proteinId: new UniqueEntityID('protein-1'),
      }),
    )
    await inMemoryOrdersRepository.create(
      makeOrder({
        brothId: new UniqueEntityID('broth-1'),
        proteinId: new UniqueEntityID('protein-1'),
      }),
    )

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(inMemoryBrothsRepository.items).toHaveLength(2)
    expect(inMemoryProteinsRepository.items).toHaveLength(1)
    expect(inMemoryOrdersRepository.items).toHaveLength(3)
    if (result.isRight()) {
      expect(result.value).toEqual({
        totalBroths: 2,
        totalProteins: 1,
        totalOrders: 3,
      })
    }
  })
})

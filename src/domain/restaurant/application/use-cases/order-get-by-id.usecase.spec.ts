import { makeBroth } from 'test/factories/restaurant/make-broth'
import { makeProtein } from 'test/factories/restaurant/make-protein'
import { InMemoryBrothsRepository } from 'test/repositories/restaurant/in-memory-broth-repository'
import { InMemoryImagesRepository } from 'test/repositories/restaurant/in-memory-image-repository'
import { InMemoryOrdersRepository } from 'test/repositories/restaurant/in-memory-order-repository'
import { InMemoryProteinsRepository } from 'test/repositories/restaurant/in-memory-protein-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ForbiddenError } from '@/core/errors/forbidden-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Order } from '../../enterprise/entities/order'
import { OrderGetByIdUseCase } from './order-get-by-id.usecase'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryBrothsRepository: InMemoryBrothsRepository
let inMemoryProteinsRepository: InMemoryProteinsRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let sut: OrderGetByIdUseCase // SUT = Subject Under Test

describe('Get Order By Id Use Case', () => {
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
    sut = new OrderGetByIdUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get an order by id', async () => {
    await inMemoryBrothsRepository.create(
      makeBroth({}, new UniqueEntityID('broth-1')),
    )
    await inMemoryProteinsRepository.create(
      makeProtein({}, new UniqueEntityID('protein-1')),
    )

    const newOrder = Order.create(
      {
        description: 'Standard Ramen',
        userId: new UniqueEntityID('user-1'),
        brothId: new UniqueEntityID('broth-1'),
        proteinId: new UniqueEntityID('protein-1'),
      },
      new UniqueEntityID('order-1'),
    )

    inMemoryOrdersRepository.items.push(newOrder)

    const result = await sut.execute({
      orderId: 'order-1',
      userId: 'user-1',
      role: 'USER',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.order.id.toString()).toEqual('order-1')
      expect(result.value.order.description).toEqual('Standard Ramen')
    }
  })

  it('should not be able to get an order with wrong id', async () => {
    const result = await sut.execute({
      orderId: 'non-existing-id',
      userId: 'user-1',
      role: 'USER',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to get an order owned by another user', async () => {
    await inMemoryBrothsRepository.create(
      makeBroth({}, new UniqueEntityID('broth-1')),
    )
    await inMemoryProteinsRepository.create(
      makeProtein({}, new UniqueEntityID('protein-1')),
    )

    const newOrder = Order.create(
      {
        description: 'Standard Ramen',
        userId: new UniqueEntityID('user-1'),
        brothId: new UniqueEntityID('broth-1'),
        proteinId: new UniqueEntityID('protein-1'),
      },
      new UniqueEntityID('order-1'),
    )

    inMemoryOrdersRepository.items.push(newOrder)

    const result = await sut.execute({
      orderId: 'order-1',
      userId: 'user-2',
      role: 'USER',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ForbiddenError)
  })

  it('should allow an admin to get an order owned by another user', async () => {
    await inMemoryBrothsRepository.create(
      makeBroth({}, new UniqueEntityID('broth-1')),
    )
    await inMemoryProteinsRepository.create(
      makeProtein({}, new UniqueEntityID('protein-1')),
    )

    const newOrder = Order.create(
      {
        description: 'Standard Ramen',
        userId: new UniqueEntityID('user-1'),
        brothId: new UniqueEntityID('broth-1'),
        proteinId: new UniqueEntityID('protein-1'),
      },
      new UniqueEntityID('order-1'),
    )

    inMemoryOrdersRepository.items.push(newOrder)

    const result = await sut.execute({
      orderId: 'order-1',
      userId: 'user-2',
      role: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.order.id.toString()).toEqual('order-1')
    }
  })
})

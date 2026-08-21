import { InMemoryOrdersRepository } from 'test/repositories/restaurant/in-memory-order-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ForbiddenError } from '@/core/errors/forbidden-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Order } from '../../enterprise/entities/order'
import { GetOrderByIdUseCase } from './order-get-by-id.usecase'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: GetOrderByIdUseCase // SUT = Subject Under Test

describe('Get Order By Id Use Case', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new GetOrderByIdUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get an order by id', async () => {
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

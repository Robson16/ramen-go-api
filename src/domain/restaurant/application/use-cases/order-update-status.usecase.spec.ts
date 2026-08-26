import { makeOrder } from 'test/factories/restaurant/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/restaurant/in-memory-order-repository'

import { OrderAlreadyDeliveredError } from '@/domain/restaurant/enterprise/entities/errors/order-already-delivered-error'

import { OrderUpdateStatusUseCase } from './order-update-status.usecase'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: OrderUpdateStatusUseCase

describe('Update Order Status Use Case', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new OrderUpdateStatusUseCase(inMemoryOrdersRepository)
  })

  it('should be able to update an order status', async () => {
    const order = makeOrder()

    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      newStatus: 'PREPARING',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0].status).toBe('PREPARING')
  })

  it('should not be able to change the status of a delivered order', async () => {
    const order = makeOrder({
      status: 'DELIVERED',
    })

    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      newStatus: 'PREPARING',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OrderAlreadyDeliveredError)
  })
})

import { makeOrder } from 'test/factories/restaurant/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/restaurant/in-memory-order-repository'

import { OrderListAllUseCase } from './order-list-all.usecase'

let inMemoryOrderRepository: InMemoryOrdersRepository
let sut: OrderListAllUseCase // Subject Under Test

describe('List Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrdersRepository()
    sut = new OrderListAllUseCase(inMemoryOrderRepository)
  })

  it('should be able to list orders', async () => {
    for (let i = 1; i <= 10; i++) {
      await inMemoryOrderRepository.create(makeOrder())
    }

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items).toHaveLength(10)
  })
})

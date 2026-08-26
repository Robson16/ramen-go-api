import { makeUser } from 'test/factories/account/make-user'
import { makeOrder } from 'test/factories/restaurant/make-order'
import { InMemoryUsersRepository } from 'test/repositories/account/in-memory-user-repository'
import { InMemoryOrdersRepository } from 'test/repositories/restaurant/in-memory-order-repository'

import { OrderListByUserUseCase } from './order-list-by-user.usecase'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: OrderListByUserUseCase // Subject Under Test

describe('List Orders by User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new OrderListByUserUseCase(
      inMemoryUsersRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to list orders by user', async () => {
    const user1 = makeUser()
    const user2 = makeUser()

    await inMemoryUsersRepository.create(user1)
    await inMemoryUsersRepository.create(user2)

    for (let i = 1; i <= 10; i++) {
      await inMemoryOrdersRepository.create(
        makeOrder({
          userId: user1.id,
        }),
      )
    }

    for (let i = 1; i <= 3; i++) {
      await inMemoryOrdersRepository.create(
        makeOrder({
          userId: user2.id,
        }),
      )
    }

    const result = await sut.execute({
      userId: user1.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(10)
      expect(
        result.value.orders.every((order) => order.userId.equals(user1.id)),
      ).toBe(true)
    }
  })

  it('should return an empty list when the user has no orders', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(0)
    }
  })

  it('should not be able to list orders for an invalid user', async () => {
    for (let i = 1; i <= 10; i++) {
      await inMemoryOrdersRepository.create(makeOrder())
    }

    const result = await sut.execute({
      userId: 'invalid-user-id',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value.message).toBe('User not found.')
    }
  })
})

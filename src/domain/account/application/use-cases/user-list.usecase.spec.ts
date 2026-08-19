import { makeUser } from 'test/factories/account/make-user'
import { InMemoryUsersRepository } from 'test/repositories/account/in-memory-user-repository'

import { ListUserUseCase } from './user-list.usecase'

let inMemoryUserRepository: InMemoryUsersRepository
let sut: ListUserUseCase // Subject Under Test

describe('List User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    sut = new ListUserUseCase(inMemoryUserRepository)
  })

  it('should be able to list users', async () => {
    for (let i = 1; i <= 10; i++) {
      await inMemoryUserRepository.create(makeUser())
    }

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items).toHaveLength(10)
  })
})

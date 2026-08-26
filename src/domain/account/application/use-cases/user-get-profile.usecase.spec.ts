import { makeUser } from 'test/factories/account/make-user'
import { InMemoryUsersRepository } from 'test/repositories/account/in-memory-user-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { UserGetProfileUseCase } from './user-get-profile.usecase'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: UserGetProfileUseCase // Subject Under Test

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new UserGetProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to get user profile by id', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user,
    })
  })

  it('should return an error if user is not found', async () => {
    const result = await sut.execute({
      userId: 'non-existent-user-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

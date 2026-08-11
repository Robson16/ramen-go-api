import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/account/make-user'
import { InMemoryUsersRepository } from 'test/repositories/account/in-memory-user-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { UpdateUserPasswordUseCase } from './user-update-password.usecase'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: UpdateUserPasswordUseCase // Subject Under Test

describe('Update User Password Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new UpdateUserPasswordUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeHasher,
    )
  })

  it('should be able to update a user password', async () => {
    const user = makeUser({
      password: await fakeHasher.hash('123456'),
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      currentPassword: '123456',
      newPassword: '654321',
    })

    const hashedPassword = await fakeHasher.hash('654321')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to update the password for a nonexistent user', async () => {
    const result = await sut.execute({
      userId: 'invalid-user-id',
      currentPassword: '123456',
      newPassword: '654321',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update the password with wrong current password', async () => {
    const user = makeUser({
      password: await fakeHasher.hash('123456'),
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      currentPassword: 'wrong-password',
      newPassword: '654321',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
    expect(inMemoryUsersRepository.items[0].password).toEqual(
      await fakeHasher.hash('123456'),
    )
  })
})

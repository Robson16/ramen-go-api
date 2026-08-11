import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryUsersRepository } from 'test/repositories/account/in-memory-user-repository'

import { UserAlreadyExistsError } from '@/domain/account/application/use-cases/errors/user-already-exists-error'

import { RegisterUserUseCase } from './user-register.usecase'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: RegisterUserUseCase // Subject Under Test

describe('Register User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be able to register a new user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    })

    // Verifies that the hash was applied correctly
    expect(inMemoryUsersRepository.items[0].password).toEqual(
      'password123-hashed',
    )
  })

  it('should not be able to register a user with same email twice', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: 'password123',
    })

    const result = await sut.execute({
      name: 'John Doe',
      email,
      password: 'password123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})

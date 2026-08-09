import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'

import { UserAlreadyExistsError } from '@/core/errors/user-already-exists-error'

import { RegisterUserUseCase } from './user-register.usecase'

let inMemoryUsersRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let sut: RegisterUserUseCase // Subject Under Test

describe('Register User use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUserRepository()
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

    // Verifica se o hash foi aplicado corretamente
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

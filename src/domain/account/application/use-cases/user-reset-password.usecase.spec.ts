import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/account/make-user'
import { InMemoryUsersRepository } from 'test/repositories/account/in-memory-user-repository'
import { InMemoryUserTokensRepository } from 'test/repositories/account/in-memory-user-token-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserToken } from '@/domain/account/enterprise/entities/user-token'

import { InvalidTokenError } from './errors/invalid-token-error'
import { UserResetPasswordUseCase } from './user-reset-password.usecase'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryUserTokensRepository: InMemoryUserTokensRepository
let fakeHasher: FakeHasher
let sut: UserResetPasswordUseCase // Subject Under Test

describe('Reset User Password Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryUserTokensRepository = new InMemoryUserTokensRepository()
    fakeHasher = new FakeHasher()

    sut = new UserResetPasswordUseCase(
      inMemoryUsersRepository,
      inMemoryUserTokensRepository,
      fakeHasher,
    )

    // Enables control of the system clock by Vitest
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Restores the normal clock after each test
    vi.useRealTimers()
  })

  it('should be able to reset the password', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const userToken = UserToken.create({
      userId: user.id.toString(),
      token: 'valid-token',
    })

    await inMemoryUserTokensRepository.create(userToken)

    const result = await sut.execute({
      token: 'valid-token',
      newPassword: 'new-password-123',
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryUsersRepository.items[0].password).toEqual(
      await fakeHasher.hash('new-password-123'),
    )
    expect(inMemoryUserTokensRepository.items).toHaveLength(0)
  })

  it('should not be able to reset password with invalid token', async () => {
    const result = await sut.execute({
      token: 'invalid-token',
      newPassword: 'new-password-123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidTokenError)
  })

  it('should not be able to reset password with expired token', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const userToken = UserToken.create({
      userId: user.id.toString(),
      token: 'valid-token',
    })

    await inMemoryUserTokensRepository.create(userToken)

    // Avança o tempo do sistema artificialmente em 2 horas e 1 minuto
    const TWO_HOURS_IN_MS = 1000 * 60 * 60 * 2
    const ONE_MINUTE_IN_MS = 1000 * 60

    vi.advanceTimersByTime(TWO_HOURS_IN_MS + ONE_MINUTE_IN_MS)

    const result = await sut.execute({
      token: 'valid-token',
      newPassword: 'new-password-123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidTokenError)
  })

  it('should not be able to reset password if user no longer exists', async () => {
    const userToken = UserToken.create({
      userId: 'non-existent-user-id',
      token: 'valid-token',
    })

    await inMemoryUserTokensRepository.create(userToken)

    const result = await sut.execute({
      token: 'valid-token',
      newPassword: 'new-password-123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

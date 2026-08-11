import { makeUser } from 'test/factories/make-user'
import { FakeMailProvider } from 'test/mailing/fake-mail-provider'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-user-repository'
import { InMemoryUserTokensRepository } from 'test/repositories/in-memory-user-token-repository'

import { SendUserPasswordResetUseCase } from './user-send-password-reset.usecase'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryUsersTokensRepository: InMemoryUserTokensRepository
let fakeMailProvider: FakeMailProvider
let sut: SendUserPasswordResetUseCase // Subject Under Test

describe('Send Password Reset Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryUsersTokensRepository = new InMemoryUserTokensRepository()
    fakeMailProvider = new FakeMailProvider()
    sut = new SendUserPasswordResetUseCase(
      inMemoryUsersRepository,
      inMemoryUsersTokensRepository,
      fakeMailProvider,
    )
  })

  it('should be able to send a password reset email', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({ email: user.email })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersTokensRepository.items).toHaveLength(1)
    expect(fakeMailProvider.items).toHaveLength(1)
    expect(fakeMailProvider.items[0]).toEqual(
      expect.objectContaining({
        to: user.email,
        variables: expect.objectContaining({
          token: inMemoryUsersTokensRepository.items[0].token,
        }),
      }),
    )
  })

  it('should not send a password reset email if user does not exist', async () => {
    const result = await sut.execute({
      email: 'non-existent-user@example.com',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersTokensRepository.items).toHaveLength(0)
    expect(fakeMailProvider.items).toHaveLength(0)
  })
})

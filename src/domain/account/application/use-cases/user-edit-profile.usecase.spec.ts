import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/account/make-user'
import { InMemoryUsersRepository } from 'test/repositories/account/in-memory-user-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { EditUserProfileUseCase } from './user-edit-profile.usecase'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: EditUserProfileUseCase // Subject Under Test

describe('Edit User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new EditUserProfileUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be able to update a user email', async () => {
    const user = makeUser({
      email: 'old-email@example.com',
      password: await fakeHasher.hash('old-password'),
    })

    await inMemoryUsersRepository.create(user)

    const newEmail = 'new-email@example.com'

    const result = await sut.execute({
      userId: user.id.toString(),
      email: newEmail,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: expect.objectContaining({
        email: newEmail,
      }),
    })
    expect(inMemoryUsersRepository.items[0].email).toEqual(newEmail)
  })

  it('should not be able to update a user email to an already existing email', async () => {
    const user1 = makeUser({
      email: 'user1@example.com',
      password: await fakeHasher.hash('password123'),
    })

    await inMemoryUsersRepository.create(user1)

    const user2 = makeUser({
      email: 'user2@example.com',
      password: await fakeHasher.hash('password456'),
    })

    await inMemoryUsersRepository.create(user2)

    const result = await sut.execute({
      userId: user1.id.toString(),
      email: user2.email, // Try to change user1's email to user2's email
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
    expect(inMemoryUsersRepository.items[0].email).toEqual('user1@example.com') // Ensure email was not changed
  })

  it('should return an error if user is not found', async () => {
    const result = await sut.execute({
      userId: 'non-existent-id',
      email: 'any@example.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to update a user name', async () => {
    const user = makeUser({
      name: 'Old Name',
    })
    await inMemoryUsersRepository.create(user)

    const newName = 'New Name'

    const result = await sut.execute({
      userId: user.id.toString(),
      name: newName,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].name).toEqual(newName)
    if (result.isRight()) {
      expect(result.value.user.name).toEqual(newName)
    }
  })

  it('should be able to update a user password', async () => {
    const user = makeUser({
      password: await fakeHasher.hash('old-password'),
    })
    await inMemoryUsersRepository.create(user)

    const newPassword = 'new-password'

    const result = await sut.execute({
      userId: user.id.toString(),
      password: newPassword,
    })

    expect(result.isRight()).toBe(true)

    const isSame = await fakeHasher.compare(
      newPassword,
      inMemoryUsersRepository.items[0].password,
    )
    expect(isSame).toBe(true)

    if (result.isRight()) {
      const isSameOnResult = await fakeHasher.compare(
        newPassword,
        result.value.user.password,
      )
      expect(isSameOnResult).toBe(true)
    }
  })
})

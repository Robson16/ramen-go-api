import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { HashGenerator } from '@/domain/account/application/cryptography/hash-generator'
import { UsersRepository } from '@/domain/account/application/repositories/user-repository'
import { User } from '@/domain/account/enterprise/entities/user'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface EditUserUseCaseRequest {
  userId: string
  name?: string
  email?: string
  password?: string
}

type EditUserUseCaseResponse = Either<
  ResourceNotFoundError | UserAlreadyExistsError,
  {
    user: User
  }
>

@Injectable()
export class EditUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    name,
    email,
    password,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    if (email && email !== user.email) {
      const userWithSameEmail = await this.usersRepository.findByEmail(email)

      if (userWithSameEmail && userWithSameEmail.id.toString() !== userId) {
        return left(new UserAlreadyExistsError(email))
      }

      user.email = email
    }

    if (name) {
      user.name = name
    }

    if (password) {
      user.password = await this.hashGenerator.hash(password)
    }

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}

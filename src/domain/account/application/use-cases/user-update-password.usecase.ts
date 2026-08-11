import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { HashComparer } from '@/domain/account/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/account/application/cryptography/hash-generator'
import { UsersRepository } from '@/domain/account/application/repositories/user-repository'
import { User } from '@/domain/account/enterprise/entities/user'

import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface UpdateUserPasswordUseCaseRequest {
  userId: string
  currentPassword: string
  newPassword: string
}

type UpdateUserPasswordUseCaseResponse = Either<
  ResourceNotFoundError | WrongCredentialsError,
  {
    user: User
  }
>

@Injectable()
export class UpdateUserPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    currentPassword,
    newPassword,
  }: UpdateUserPasswordUseCaseRequest): Promise<UpdateUserPasswordUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const currentPasswordConfirm = await this.hashComparer.compare(
      currentPassword,
      user.password,
    )

    if (!currentPasswordConfirm) {
      return left(new WrongCredentialsError())
    }

    const hashedPassword = await this.hashGenerator.hash(newPassword)

    user.password = hashedPassword

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}

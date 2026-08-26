import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { HashGenerator } from '@/domain/account/application/cryptography/hash-generator'
import { UsersRepository } from '@/domain/account/application/repositories/user-repository'
import { UserTokensRepository } from '@/domain/account/application/repositories/user-tokens-repository'

import { InvalidTokenError } from './errors/invalid-token-error'

dayjs.locale('pt-br')

interface ResetUserPasswordUseCaseRequest {
  token: string
  newPassword: string
}

type ResetUserPasswordUseCaseResponse = Either<
  ResourceNotFoundError | InvalidTokenError,
  null
>

@Injectable()
export class UserResetPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userTokensRepository: UserTokensRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    token,
    newPassword,
  }: ResetUserPasswordUseCaseRequest): Promise<ResetUserPasswordUseCaseResponse> {
    const userToken = await this.userTokensRepository.findByToken(token)

    if (!userToken) {
      return left(new InvalidTokenError('Invalid token.'))
    }

    const user = await this.usersRepository.findById(userToken.userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const isExpired = dayjs().diff(dayjs(userToken.createdAt), 'hour') >= 2

    if (isExpired) {
      return left(new InvalidTokenError('Expired token.'))
    }

    const hashedPassword = await this.hashGenerator.hash(newPassword)

    user.password = hashedPassword

    await this.usersRepository.save(user)

    await this.userTokensRepository.delete(userToken)

    return right(null)
  }
}

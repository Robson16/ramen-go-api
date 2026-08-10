import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Encrypter } from '@/domain/account/application/cryptography/encrypter'
import { HashComparer } from '@/domain/account/application/cryptography/hash-comparer'
import { UsersRepository } from '@/domain/account/application/repositories/user-repository'

import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashCompare: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}

import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { HashGenerator } from '@/domain/account/application/cryptography/hash-generator'
import { MailProvider } from '@/domain/account/application/mailing/mail-provider'
import { UsersRepository } from '@/domain/account/application/repositories/user-repository'
import { UserAlreadyExistsError } from '@/domain/account/application/use-cases/errors/user-already-exists-error'
import { User } from '@/domain/account/enterprise/entities/user'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User
  }
>

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private mailProvider: MailProvider,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.usersRepository.create(user)

    await this.mailProvider.send({
      to: user.email,
      subject: 'Bem-vindo(a) ao Ramen Go! 🍜',
      template: 'welcome',
      variables: {
        name: user.name,
      },
    })

    return right({
      user,
    })
  }
}

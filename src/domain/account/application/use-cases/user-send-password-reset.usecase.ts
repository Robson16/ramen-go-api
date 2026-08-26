import { randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { MailProvider } from '@/domain/account/application/mailing/mail-provider'
import { UsersRepository } from '@/domain/account/application/repositories/user-repository'
import { UserTokensRepository } from '@/domain/account/application/repositories/user-tokens-repository'
import { UserToken } from '@/domain/account/enterprise/entities/user-token'

interface SendUserPasswordResetUseCaseRequest {
  email: string
}

type SendUserPasswordResetUseCaseResponse = Either<null, null>

@Injectable()
export class UserSendPasswordResetUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userTokensRepository: UserTokensRepository,
    private mailProvider: MailProvider,
  ) {}

  async execute({
    email,
  }: SendUserPasswordResetUseCaseRequest): Promise<SendUserPasswordResetUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      // Prevent User Enumeration; if it doesn't find it,
      // we silently return success, but the system did nothing.
      return right(null)
    }

    const resetToken = UserToken.create({
      userId: user.id.toString(),
      token: randomUUID(),
    })

    await this.userTokensRepository.create(resetToken)

    await this.mailProvider.send({
      to: user.email,
      subject: 'Redefinição de senha',
      template: 'password-reset',
      variables: {
        name: user.name,
        token: resetToken.token,
      },
    })

    return right(null)
  }
}

import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { UsersRepository } from '@/domain/account/application/repositories/user-repository'
import { User } from '@/domain/account/enterprise/entities/user'

type ListUserUseCaseResponse = Either<
  null,
  {
    users: User[]
  }
>

@Injectable()
export class UserListUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(): Promise<ListUserUseCaseResponse> {
    const users = await this.usersRepository.findMany()

    return right({
      users,
    })
  }
}

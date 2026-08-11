import { Injectable } from '@nestjs/common'

import { User, UserProps } from '@/domain/account/enterprise/entities/user'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/account/prisma-user-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { makeUser } from './make-user'

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data)

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })

    return user
  }
}

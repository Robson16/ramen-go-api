import { Injectable } from '@nestjs/common'

import { UserTokensRepository } from '@/domain/account/application/repositories/user-tokens-repository'
import { UserToken } from '@/domain/account/enterprise/entities/user-token'
import { PrismaUserTokenMapper } from '@/infra/database/prisma/mappers/account/prisma-user-token-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

@Injectable()
export class PrismaUserTokensRepository implements UserTokensRepository {
  constructor(private prisma: PrismaService) {}

  async create(token: UserToken): Promise<void> {
    const data = PrismaUserTokenMapper.toPrisma(token)

    await this.prisma.userToken.create({
      data,
    })
  }

  async findByToken(token: string): Promise<UserToken | null> {
    const prismaToken = await this.prisma.userToken.findUnique({
      where: {
        token,
      },
    })

    if (!prismaToken) {
      return null
    }

    return PrismaUserTokenMapper.toDomain(prismaToken)
  }

  async delete(token: UserToken): Promise<void> {
    await this.prisma.userToken.delete({
      where: {
        id: token.id.toString(),
      },
    })
  }
}

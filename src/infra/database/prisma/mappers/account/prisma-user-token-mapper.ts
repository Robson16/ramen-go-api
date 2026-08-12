import { Prisma, UserToken as PrismaUserToken } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserToken } from '@/domain/account/enterprise/entities/user-token'

export class PrismaUserTokenMapper {
  static toDomain(raw: PrismaUserToken): UserToken {
    return UserToken.create(
      {
        token: raw.token,
        userId: raw.userId,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(userToken: UserToken): Prisma.UserTokenUncheckedCreateInput {
    return {
      id: userToken.id.toString(),
      token: userToken.token,
      userId: userToken.userId,
      createdAt: userToken.createdAt,
    }
  }
}

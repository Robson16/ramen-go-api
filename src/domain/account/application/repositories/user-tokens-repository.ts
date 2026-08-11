import { UserToken } from '@/domain/account/enterprise/entities/user-token'

export abstract class UserTokensRepository {
  abstract create(token: UserToken): Promise<void>
  abstract findByToken(token: string): Promise<UserToken | null>
  abstract delete(token: UserToken): Promise<void>
}

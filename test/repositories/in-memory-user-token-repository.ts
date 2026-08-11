import { UserTokensRepository } from '@/domain/account/application/repositories/user-tokens-repository'
import { UserToken } from '@/domain/account/enterprise/entities/user-token'

export class InMemoryUserTokensRepository implements UserTokensRepository {
  public items: UserToken[] = []

  async create(userToken: UserToken): Promise<void> {
    this.items.push(userToken)
  }

  async findByToken(token: string): Promise<UserToken | null> {
    const userToken = this.items.find((item) => item.token === token)

    if (!userToken) {
      return null
    }

    return userToken
  }

  async delete(userToken: UserToken): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === userToken.id)

    this.items.splice(itemIndex, 1)
  }
}

import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface UserTokenProps {
  userId: string
  token: string
  createdAt: Date
}

export class UserToken extends Entity<UserTokenProps> {
  get userId() {
    return this.props.userId
  }

  set userId(userId: string) {
    this.props.userId = userId
  }

  get token() {
    return this.props.token
  }

  set token(token: string) {
    this.props.token = token
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<UserTokenProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const userToken = new UserToken(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return userToken
  }
}

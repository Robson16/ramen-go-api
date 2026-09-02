import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { OrderStatus } from '@/domain/restaurant/enterprise/entities/order'

export interface OrderWithDetailsProps {
  id: UniqueEntityID
  userId: UniqueEntityID
  brothId: UniqueEntityID
  proteinId: UniqueEntityID
  description: string
  status: OrderStatus
  createdAt: Date
  updatedAt?: Date | null
  broth: {
    name: string
  }
  protein: {
    name: string
  }
  user?: {
    name: string
  } | null
}

export class OrderWithDetails extends ValueObject<OrderWithDetailsProps> {
  get id() {
    return this.props.id
  }

  get userId() {
    return this.props.userId
  }

  get brothId() {
    return this.props.brothId
  }

  get proteinId() {
    return this.props.proteinId
  }

  get description() {
    return this.props.description
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get broth() {
    return this.props.broth
  }

  get protein() {
    return this.props.protein
  }

  get user() {
    return this.props.user
  }

  static create(props: OrderWithDetailsProps) {
    return new OrderWithDetails(props)
  }
}

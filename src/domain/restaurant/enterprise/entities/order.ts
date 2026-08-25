import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { OrderAlreadyDeliveredError } from './errors/order-already-delivered-error'

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED'

export interface OrderProps {
  userId: UniqueEntityID
  brothId: UniqueEntityID
  proteinId: UniqueEntityID
  description: string
  status: OrderStatus
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends Entity<OrderProps> {
  get userId() {
    return this.props.userId
  }

  get brothId() {
    return this.props.brothId
  }

  set brothId(brothId: UniqueEntityID) {
    this.props.brothId = brothId
    this.touch()
  }

  get proteinId() {
    return this.props.proteinId
  }

  set proteinId(proteinId: UniqueEntityID) {
    this.props.proteinId = proteinId
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
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

  private touch() {
    this.props.updatedAt = new Date()
  }

  changeStatus(status: OrderStatus) {
    if (this.props.status === 'DELIVERED' && status !== 'DELIVERED') {
      throw new OrderAlreadyDeliveredError()
    }

    this.props.status = status
    this.touch()
  }

  static create(
    props: Optional<OrderProps, 'status' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        status: props.status ?? 'PENDING',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return order
  }
}

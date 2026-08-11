import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Order,
  OrderProps,
} from '@/domain/restaurant/enterprise/entities/order'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
): Order {
  const order = Order.create(
    {
      description: faker.lorem.sentence(),
      brothId: new UniqueEntityID(),
      proteinId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return order
}

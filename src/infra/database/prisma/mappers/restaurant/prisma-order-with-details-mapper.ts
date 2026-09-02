import { Broth, Order as PrismaOrder, Protein, User } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderStatus } from '@/domain/restaurant/enterprise/entities/order'
import { OrderWithDetails } from '@/domain/restaurant/enterprise/entities/value-objects/order-with-details'

type PrismaOrderWithDetails = PrismaOrder & {
  broth: Broth | null
  protein: Protein | null
  user: User | null
}

export class PrismaOrderWithDetailsMapper {
  static toDomain(raw: PrismaOrderWithDetails): OrderWithDetails {
    if (!raw.broth) {
      throw new Error(`Broth for order "${raw.id}" does not exist.`)
    }

    if (!raw.protein) {
      throw new Error(`Protein for order "${raw.id}" does not exist.`)
    }

    return OrderWithDetails.create({
      id: new UniqueEntityID(raw.id),
      userId: new UniqueEntityID(raw.userId),
      brothId: new UniqueEntityID(raw.brothId),
      proteinId: new UniqueEntityID(raw.proteinId),
      description: raw.description,
      status: raw.status as OrderStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      broth: { name: raw.broth.name },
      protein: { name: raw.protein.name },
      user: raw.user ? { name: raw.user.name } : null,
    })
  }
}

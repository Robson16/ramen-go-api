import { Broth as PrismaBroth, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Broth } from '@/domain/restaurant/enterprise/entities/broth'

export class PrismaBrothMapper {
  static toDomain(raw: PrismaBroth): Broth {
    return Broth.create(
      {
        name: raw.name,
        description: raw.description,
        price: Number(raw.price),
        imageActiveId: raw.imageActiveId,
        imageInactiveId: raw.imageInactiveId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(broth: Broth): Prisma.BrothUncheckedCreateInput {
    return {
      id: broth.id.toString(),
      name: broth.name,
      description: broth.description,
      price: broth.price,
      imageActiveId: broth.imageActiveId,
      imageInactiveId: broth.imageInactiveId,
      createdAt: broth.createdAt,
      updatedAt: broth.updatedAt,
    }
  }
}

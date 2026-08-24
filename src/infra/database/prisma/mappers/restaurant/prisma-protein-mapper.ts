import { Prisma, Protein as PrismaProtein } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Protein } from '@/domain/restaurant/enterprise/entities/protein'

export class PrismaProteinMapper {
  static toDomain(raw: PrismaProtein): Protein {
    return Protein.create(
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

  static toPrisma(protein: Protein): Prisma.ProteinUncheckedCreateInput {
    return {
      id: protein.id.toString(),
      name: protein.name,
      description: protein.description,
      price: protein.price,
      imageActiveId: protein.imageActiveId,
      imageInactiveId: protein.imageInactiveId,
      createdAt: protein.createdAt,
      updatedAt: protein.updatedAt,
    }
  }
}

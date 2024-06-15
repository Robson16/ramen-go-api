import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Protein } from '@/domain/restaurant/enterprise/entities/protein';
import { Prisma, Protein as PrismaProtein } from '@prisma/client';

export class PrismaProteinMapper {
  static toDomain(raw: PrismaProtein): Protein {
    return Protein.create(
      {
        name: raw.name,
        description: raw.description,
        price: Number(raw.price),
        imageActiveId: raw.imageActiveId,
        imageInactiveId: raw.imageInactiveId,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(protein: Protein): Prisma.ProteinUncheckedCreateInput {
    return {
      id: protein.id.toString(),
      name: protein.name,
      description: protein.description,
      price: protein.price,
      imageActiveId: protein.imageActiveId,
      imageInactiveId: protein.imageInactiveId,
    };
  }
}

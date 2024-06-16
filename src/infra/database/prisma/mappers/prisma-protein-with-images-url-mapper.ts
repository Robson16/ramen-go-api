import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ProteinWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/protein-with-images-url';
import { Protein as PrismaProtein } from '@prisma/client';

type PrismaProteinWithImagesUrl = PrismaProtein & {
  imageActive: {
    id: string;
    title: string;
    url: string;
  } | null;
  imageInactive: {
    id: string;
    title: string;
    url: string;
  } | null;
};

export class PrismaProteinWithImagesUrlMapper {
  static toDomain(raw: PrismaProteinWithImagesUrl): ProteinWithImagesUrl {
    if (!raw.imageActive) {
      throw new Error(
        `Image Active with ID "${raw.imageActiveId}" does not exist.`,
      );
    }

    if (!raw.imageInactive) {
      throw new Error(
        `Image Inactive with ID "${raw.imageInactiveId}" does not exist.`,
      );
    }

    return ProteinWithImagesUrl.create({
      id: new UniqueEntityID(raw.id),
      name: raw.name,
      description: raw.description,
      price: Number(raw.price),
      imageActiveUrl: raw.imageActive.url,
      imageInactiveUrl: raw.imageInactive.url,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}

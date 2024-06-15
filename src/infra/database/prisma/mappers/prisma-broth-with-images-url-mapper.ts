import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { BrothWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/broth-with-images-url';
import { Broth as PrismaBroth } from '@prisma/client';

type PrismaBrothWithImagesUrl = PrismaBroth & {
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

export class PrismaBrothWithImagesUrlMapper {
  static toDomain(raw: PrismaBrothWithImagesUrl): BrothWithImagesUrl {
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

    return BrothWithImagesUrl.create({
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

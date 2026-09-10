import { Protein as PrismaProtein } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Image } from '@/domain/media/enterprise/entities/image'
import { ProteinWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/protein-with-images-url'

type PrismaProteinWithImagesUrl = PrismaProtein & {
  imageActive: {
    id: string
    title: string
    url: string
    createdAt: Date
    updatedAt: Date | null
  } | null
  imageInactive: {
    id: string
    title: string
    url: string
    createdAt: Date
    updatedAt: Date | null
  } | null
}

export class PrismaProteinWithImagesUrlMapper {
  static toDomain(raw: PrismaProteinWithImagesUrl): ProteinWithImagesUrl {
    if (!raw.imageActive) {
      throw new Error(
        `Image Active with ID "${raw.imageActiveId}" does not exist.`,
      )
    }

    if (!raw.imageInactive) {
      throw new Error(
        `Image Inactive with ID "${raw.imageInactiveId}" does not exist.`,
      )
    }

    return ProteinWithImagesUrl.create({
      id: new UniqueEntityID(raw.id),
      name: raw.name,
      description: raw.description,
      price: Number(raw.price),
      imageActive: Image.create(
        {
          title: raw.imageActive.title,
          url: raw.imageActive.url,
          createdAt: raw.imageActive.createdAt,
          updatedAt: raw.imageActive.updatedAt,
        },
        new UniqueEntityID(raw.imageActive.id),
      ),
      imageInactive: Image.create(
        {
          title: raw.imageInactive.title,
          url: raw.imageInactive.url,
          createdAt: raw.imageInactive.createdAt,
          updatedAt: raw.imageInactive.updatedAt,
        },
        new UniqueEntityID(raw.imageInactive.id),
      ),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}

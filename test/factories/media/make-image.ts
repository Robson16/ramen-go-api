import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Image, ImageProps } from '@/domain/media/enterprise/entities/image'

export function makeImage(
  override: Partial<ImageProps> = {},
  id?: UniqueEntityID,
): Image {
  const image = Image.create(
    {
      title: faker.lorem.word(),
      url: faker.image.url(),
      ...override,
    },
    id,
  )

  return image
}

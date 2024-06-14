import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Image,
  ImageProps,
} from '@/domain/restaurant/enterprise/entities/image';
import { faker } from '@faker-js/faker';

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
  );

  return image;
}

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Broth,
  BrothProps,
} from '@/domain/restaurant/enterprise/entities/broth';
import { faker } from '@faker-js/faker';

export function makeBroth(
  override: Partial<BrothProps> = {},
  id?: UniqueEntityID,
): Broth {
  const broth = Broth.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      ...override,
    },
    id,
  );

  return broth;
}

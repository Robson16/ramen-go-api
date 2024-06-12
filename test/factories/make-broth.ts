import {
  Broth,
  BrothProps,
} from '@/domain/restaurant/enterprise/entities/broth';
import { faker } from '@faker-js/faker';

export function makeBroth(
  override: Partial<BrothProps> = {},
  id?: number,
): Broth {
  const broth = Broth.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      ...override,
    },
    id,
  );

  return broth;
}

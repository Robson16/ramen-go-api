import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Protein,
  ProteinProps,
} from '@/domain/restaurant/enterprise/entities/protein';
import { faker } from '@faker-js/faker';

export function makeProtein(
  override: Partial<ProteinProps> = {},
  id?: UniqueEntityID,
): Protein {
  const protein = Protein.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      imageActiveId: new UniqueEntityID().toString(),
      imageInactiveId: new UniqueEntityID().toString(),
      ...override,
    },
    id,
  );

  return protein;
}

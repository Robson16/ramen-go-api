import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository';
import { Protein } from '@/domain/restaurant/enterprise/entities/protein';

export class InMemoryProteinsRepository implements ProteinsRepository {
  public items: Protein[] = [];

  async findByName(name: string): Promise<Protein | null> {
    const protein = this.items.find((item) => item.name === name);

    if (!protein) {
      return null;
    }

    return protein;
  }

  async create(protein: Protein) {
    this.items.push(protein);
  }
}

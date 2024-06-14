import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository';
import { Broth } from '@/domain/restaurant/enterprise/entities/broth';

export class InMemoryBrothsRepository implements BrothsRepository {
  public items: Broth[] = [];

  async findByName(name: string): Promise<Broth | null> {
    const broth = this.items.find((item) => item.name === name);

    if (!broth) {
      return null;
    }

    return broth;
  }

  async create(broth: Broth) {
    this.items.push(broth);
  }
}

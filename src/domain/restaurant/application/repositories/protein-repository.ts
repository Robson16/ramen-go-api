import { Protein } from '@/domain/restaurant/enterprise/entities/protein';

export abstract class ProteinsRepository {
  abstract findByName(name: string): Promise<Protein | null>;
  abstract create(protein: Protein): Promise<void>;
}

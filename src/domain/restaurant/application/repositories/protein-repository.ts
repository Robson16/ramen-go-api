import { Protein } from '@/domain/restaurant/enterprise/entities/protein';
import { ProteinWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/protein-with-images-url';

export abstract class ProteinsRepository {
  abstract findByName(name: string): Promise<Protein | null>;
  abstract findMany(): Promise<Protein[]>;
  abstract findManyWithImagesUrl(): Promise<ProteinWithImagesUrl[]>;
  abstract create(protein: Protein): Promise<void>;
}

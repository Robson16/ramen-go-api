import { Broth } from '@/domain/restaurant/enterprise/entities/broth';
import { BrothWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/broth-with-images-url';

export abstract class BrothsRepository {
  abstract findById(id: string): Promise<Broth | null>;
  abstract findByName(name: string): Promise<Broth | null>;
  abstract findMany(): Promise<Broth[]>;
  abstract findManyWithImagesUrl(): Promise<BrothWithImagesUrl[]>;
  abstract create(broth: Broth): Promise<void>;
}

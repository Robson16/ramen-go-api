import { Broth } from '@/domain/restaurant/enterprise/entities/broth';

export abstract class BrothsRepository {
  abstract findByName(name: string): Promise<Broth | null>;
  abstract create(broth: Broth): Promise<void>;
}

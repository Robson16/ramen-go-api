import { Image } from '@/domain/restaurant/enterprise/entities/image';

export abstract class ImagesRepository {
  abstract findByID(id: string): Promise<Image | null>;
  abstract create(image: Image): Promise<void>;
}

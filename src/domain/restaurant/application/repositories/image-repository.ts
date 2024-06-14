import { Image } from '@/domain/restaurant/enterprise/entities/image';

export abstract class ImagesRepository {
  abstract create(image: Image): Promise<void>;
}

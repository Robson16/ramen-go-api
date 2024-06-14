import { ImagesRepository } from '@/domain/restaurant/application/repositories/image-repository';
import { Image } from '@/domain/restaurant/enterprise/entities/image';

export class InMemoryImagesRepository implements ImagesRepository {
  public items: Image[] = [];

  async create(image: Image) {
    this.items.push(image);
  }
}

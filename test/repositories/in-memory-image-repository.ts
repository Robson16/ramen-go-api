import { ImagesRepository } from '@/domain/restaurant/application/repositories/image-repository';
import { Image } from '@/domain/restaurant/enterprise/entities/image';

export class InMemoryImagesRepository implements ImagesRepository {
  public items: Image[] = [];

  async findByID(id: string) {
    const image = this.items.find((item) => item.id.toString() === id);

    if (!image) {
      return null;
    }

    return image;
  }

  async create(image: Image) {
    this.items.push(image);
  }
}

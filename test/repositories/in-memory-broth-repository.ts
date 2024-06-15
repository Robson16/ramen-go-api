import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository';
import { Broth } from '@/domain/restaurant/enterprise/entities/broth';
import { BrothWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/broth-with-images-url';
import { InMemoryImagesRepository } from './in-memory-image-repository';

export class InMemoryBrothsRepository implements BrothsRepository {
  public items: Broth[] = [];

  constructor(private inMemoryImagesRepository: InMemoryImagesRepository) {}

  async findByName(name: string): Promise<Broth | null> {
    const broth = this.items.find((item) => item.name === name);

    if (!broth) {
      return null;
    }

    return broth;
  }

  async findMany() {
    return this.items;
  }

  async findManyWithImagesUrl(): Promise<BrothWithImagesUrl[]> {
    const broths = await Promise.all(
      this.items.map(async (broth) => {
        const imageActive = await this.inMemoryImagesRepository.findByID(
          broth.imageActiveId,
        );

        if (!imageActive) {
          throw new Error(
            `Image Active with ID "${broth.imageActiveId.toString()}" does not exist.`,
          );
        }

        const imageInactive = await this.inMemoryImagesRepository.findByID(
          broth.imageInactiveId,
        );

        if (!imageInactive) {
          throw new Error(
            `Image Inactive with ID "${broth.imageInactiveId.toString()}" does not exist.`,
          );
        }

        return BrothWithImagesUrl.create({
          id: broth.id,
          name: broth.name,
          description: broth.description,
          price: broth.price,
          imageActiveUrl: imageActive.url,
          imageInactiveUrl: imageInactive.url,
          createdAt: broth.createdAt,
          updatedAt: broth.updatedAt,
        });
      }),
    );

    return broths;
  }

  async create(broth: Broth) {
    this.items.push(broth);
  }
}

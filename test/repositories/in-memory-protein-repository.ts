import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository';
import { Protein } from '@/domain/restaurant/enterprise/entities/protein';
import { ProteinWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/protein-with-images-url';
import { InMemoryImagesRepository } from './in-memory-image-repository';

export class InMemoryProteinsRepository implements ProteinsRepository {
  public items: Protein[] = [];

  constructor(private inMemoryImagesRepository: InMemoryImagesRepository) {}

  async findByName(name: string): Promise<Protein | null> {
    const protein = this.items.find((item) => item.name === name);

    if (!protein) {
      return null;
    }

    return protein;
  }

  async findMany() {
    return this.items;
  }

  async findManyWithImagesUrl(): Promise<ProteinWithImagesUrl[]> {
    const proteins = await Promise.all(
      this.items.map(async (protein) => {
        const imageActive = await this.inMemoryImagesRepository.findByID(
          protein.imageActiveId,
        );

        if (!imageActive) {
          throw new Error(
            `Image Active with ID "${protein.imageActiveId.toString()}" does not exist.`,
          );
        }

        const imageInactive = await this.inMemoryImagesRepository.findByID(
          protein.imageInactiveId,
        );

        if (!imageInactive) {
          throw new Error(
            `Image Inactive with ID "${protein.imageInactiveId.toString()}" does not exist.`,
          );
        }

        return ProteinWithImagesUrl.create({
          id: protein.id,
          name: protein.name,
          description: protein.description,
          price: protein.price,
          imageActiveUrl: imageActive.url,
          imageInactiveUrl: imageInactive.url,
          createdAt: protein.createdAt,
          updatedAt: protein.updatedAt,
        });
      }),
    );

    return proteins;
  }

  async create(protein: Protein) {
    this.items.push(protein);
  }
}

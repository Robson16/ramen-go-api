import { ProteinWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/protein-with-images-url'

export class ProteinPresenter {
  static toHTTP(protein: ProteinWithImagesUrl) {
    return {
      id: protein.id.toString(),
      name: protein.name,
      description: protein.description,
      price: protein.price,
      imageActive: {
        id: protein.imageActive.id.toString(),
        url: protein.imageActive.url,
      },
      imageInactive: {
        id: protein.imageInactive.id.toString(),
        url: protein.imageInactive.url,
      },
      createdAt: protein.createdAt,
      updatedAt: protein.updatedAt,
    }
  }
}

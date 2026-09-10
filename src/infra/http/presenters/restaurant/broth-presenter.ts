import { BrothWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/broth-with-images-url'

export class BrothPresenter {
  static toHTTP(broth: BrothWithImagesUrl) {
    return {
      id: broth.id.toString(),
      name: broth.name,
      description: broth.description,
      price: broth.price,
      imageActive: {
        id: broth.imageActive.id.toString(),
        url: broth.imageActive.url,
      },
      imageInactive: {
        id: broth.imageInactive.id.toString(),
        url: broth.imageInactive.url,
      },
      createdAt: broth.createdAt,
      updatedAt: broth.updatedAt,
    }
  }
}

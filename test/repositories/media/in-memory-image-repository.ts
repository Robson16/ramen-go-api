import { ImagesRepository } from '@/domain/media/application/repositories/image-repository'
import { Image } from '@/domain/media/enterprise/entities/image'

export class InMemoryImagesRepository implements ImagesRepository {
  public items: Image[] = []

  async findByID(id: string) {
    const image = this.items.find((item) => item.id.toString() === id)

    if (!image) {
      return null
    }

    return image
  }

  async findMany(page: number): Promise<Image[]> {
    const itemsPerPage = 24 // Default

    return this.items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  }

  async create(image: Image) {
    this.items.push(image)
  }

  async save(image: Image): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === image.id)

    this.items[itemIndex] = image
  }

  async delete(image: Image): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === image.id)

    this.items.splice(itemIndex, 1)
  }

  async count(): Promise<number> {
    return this.items.length
  }
}

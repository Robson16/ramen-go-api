import { Image } from '@/domain/media/enterprise/entities/image'

export abstract class ImagesRepository {
  abstract findByID(id: string): Promise<Image | null>
  abstract findMany(page: number): Promise<Image[]>
  abstract create(image: Image): Promise<void>
  abstract save(image: Image): Promise<void>
  abstract delete(image: Image): Promise<void>
  abstract count(): Promise<number>
}

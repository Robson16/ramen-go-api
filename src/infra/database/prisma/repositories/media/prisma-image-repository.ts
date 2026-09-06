import { Injectable } from '@nestjs/common'

import { ImagesRepository } from '@/domain/media/application/repositories/image-repository'
import { Image } from '@/domain/media/enterprise/entities/image'
import { PrismaImageMapper } from '@/infra/database/prisma/mappers/restaurant/prisma-image-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

@Injectable()
export class PrismaImagesRepository implements ImagesRepository {
  constructor(private prisma: PrismaService) {}

  async findByID(id: string): Promise<Image | null> {
    const image = await this.prisma.image.findUnique({
      where: {
        id,
      },
    })

    if (!image) {
      return null
    }

    return PrismaImageMapper.toDomain(image)
  }

  async findMany(page: number): Promise<Image[]> {
    const itemsPerPage = 20

    const images = await this.prisma.image.findMany({
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
    })

    return images.map((image) => PrismaImageMapper.toDomain(image))
  }

  async create(image: Image): Promise<void> {
    const data = PrismaImageMapper.toPrisma(image)

    await this.prisma.image.create({
      data,
    })
  }

  async save(image: Image): Promise<void> {
    const data = PrismaImageMapper.toPrisma(image)

    await this.prisma.image.update({
      where: {
        id: image.id.toString(),
      },
      data,
    })
  }

  async delete(image: Image): Promise<void> {
    await this.prisma.image.delete({
      where: {
        id: image.id.toString(),
      },
    })
  }

  async count(): Promise<number> {
    return await this.prisma.image.count()
  }
}

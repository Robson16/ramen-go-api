import { ImagesRepository } from '@/domain/restaurant/application/repositories/image-repository';
import { Image } from '@/domain/restaurant/enterprise/entities/image';
import { Injectable } from '@nestjs/common';
import { PrismaImageMapper } from '../mappers/prisma-image-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaImagesRepository implements ImagesRepository {
  constructor(private prisma: PrismaService) {}

  async create(image: Image): Promise<void> {
    const data = PrismaImageMapper.toPrisma(image);

    await this.prisma.image.create({
      data,
    });
  }
}

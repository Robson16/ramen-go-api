import {
  Image,
  ImageProps,
} from '@/domain/restaurant/enterprise/entities/image';
import { PrismaImageMapper } from '@/infra/database/prisma/mappers/prisma-image-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { makeImage } from './make-image';

@Injectable()
export class ImageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaImage(data: Partial<ImageProps> = {}): Promise<Image> {
    const image = makeImage(data);

    await this.prisma.image.create({
      data: PrismaImageMapper.toPrisma(image),
    });

    return image;
  }
}

import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository';
import { Broth } from '@/domain/restaurant/enterprise/entities/broth';
import { BrothWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/broth-with-images-url';
import { PrismaBrothMapper } from '@/infra/database/prisma/mappers/prisma-broth-mapper';
import { Injectable } from '@nestjs/common';
import { PrismaBrothWithImagesUrlMapper } from '../mappers/prisma-broth-with-images-url-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaBrothsRepository implements BrothsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Broth | null> {
    const broth = await this.prisma.broth.findUnique({
      where: {
        id,
      },
    });

    if (!broth) {
      return null;
    }

    return PrismaBrothMapper.toDomain(broth);
  }

  async findByName(name: string): Promise<Broth | null> {
    const broth = await this.prisma.broth.findUnique({
      where: {
        name,
      },
    });

    if (!broth) {
      return null;
    }

    return PrismaBrothMapper.toDomain(broth);
  }

  async findMany(): Promise<Broth[]> {
    const broths = await this.prisma.broth.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return broths.map(PrismaBrothMapper.toDomain);
  }

  async findManyWithImagesUrl(): Promise<BrothWithImagesUrl[]> {
    const broths = await this.prisma.broth.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        imageActive: true,
        imageInactive: true,
      },
    });

    return broths.map(PrismaBrothWithImagesUrlMapper.toDomain);
  }

  async create(broth: Broth): Promise<void> {
    const data = PrismaBrothMapper.toPrisma(broth);

    await this.prisma.broth.create({
      data,
    });
  }
}

import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository';
import { Protein } from '@/domain/restaurant/enterprise/entities/protein';
import { ProteinWithImagesUrl } from '@/domain/restaurant/enterprise/entities/value-objects/protein-with-images-url';
import { PrismaProteinMapper } from '@/infra/database/prisma/mappers/prisma-protein-mapper';
import { PrismaProteinWithImagesUrlMapper } from '@/infra/database/prisma/mappers/prisma-protein-with-images-url-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaProteinRepository implements ProteinsRepository {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string): Promise<Protein | null> {
    const protein = await this.prisma.protein.findUnique({
      where: {
        name,
      },
    });

    if (!protein) {
      return null;
    }

    return PrismaProteinMapper.toDomain(protein);
  }

  async findMany(): Promise<Protein[]> {
    const proteins = await this.prisma.protein.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return proteins.map(PrismaProteinMapper.toDomain);
  }

  async findManyWithImagesUrl(): Promise<ProteinWithImagesUrl[]> {
    const proteins = await this.prisma.protein.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        imageActive: true,
        imageInactive: true,
      },
    });

    return proteins.map(PrismaProteinWithImagesUrlMapper.toDomain);
  }

  async create(protein: Protein): Promise<void> {
    const data = PrismaProteinMapper.toPrisma(protein);

    await this.prisma.protein.create({
      data,
    });
  }
}

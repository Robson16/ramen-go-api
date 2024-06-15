import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository';
import { Protein } from '@/domain/restaurant/enterprise/entities/protein';
import { PrismaProteinMapper } from '@/infra/database/prisma/mappers/prisma-protein-mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

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

  async create(protein: Protein): Promise<void> {
    const data = PrismaProteinMapper.toPrisma(protein);

    await this.prisma.protein.create({
      data,
    });
  }
}

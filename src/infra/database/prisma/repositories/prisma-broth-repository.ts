import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository';
import { Broth } from '@/domain/restaurant/enterprise/entities/broth';
import { PrismaBrothMapper } from '@/infra/database/prisma/mappers/prisma-broth-mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaBrothRepository implements BrothsRepository {
  constructor(private prisma: PrismaService) {}

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

  async create(broth: Broth): Promise<void> {
    const data = PrismaBrothMapper.toPrisma(broth);

    await this.prisma.broth.create({
      data,
    });
  }
}

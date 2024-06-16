import {
  Protein,
  ProteinProps,
} from '@/domain/restaurant/enterprise/entities/protein';
import { PrismaProteinMapper } from '@/infra/database/prisma/mappers/prisma-protein-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { makeProtein } from './make-protein';

@Injectable()
export class ProteinFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaProtein(data: Partial<ProteinProps> = {}): Promise<Protein> {
    const protein = makeProtein(data);

    await this.prisma.protein.create({
      data: PrismaProteinMapper.toPrisma(protein),
    });

    return protein;
  }
}

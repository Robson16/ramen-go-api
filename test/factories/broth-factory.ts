import {
  Broth,
  BrothProps,
} from '@/domain/restaurant/enterprise/entities/broth';
import { PrismaBrothMapper } from '@/infra/database/prisma/mappers/prisma-broth-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { makeBroth } from './make-broth';

@Injectable()
export class BrothFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaBroth(data: Partial<BrothProps> = {}): Promise<Broth> {
    const broth = makeBroth(data);

    await this.prisma.broth.create({
      data: PrismaBrothMapper.toPrisma(broth),
    });

    return broth;
  }
}

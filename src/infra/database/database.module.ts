import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository';
import { ImagesRepository } from '@/domain/restaurant/application/repositories/image-repository';
import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaBrothRepository } from './prisma/repositories/prisma-broth-repository';
import { PrismaImagesRepository } from './prisma/repositories/prisma-image-repository';
import { PrismaProteinRepository } from './prisma/repositories/prisma-protein-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: BrothsRepository,
      useClass: PrismaBrothRepository,
    },
    {
      provide: ProteinsRepository,
      useClass: PrismaProteinRepository,
    },
    {
      provide: ImagesRepository,
      useClass: PrismaImagesRepository,
    },
  ],
  exports: [
    PrismaService,
    BrothsRepository,
    ProteinsRepository,
    ImagesRepository,
  ],
})
export class DatabaseModule {}

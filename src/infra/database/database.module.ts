import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository';
import { ImagesRepository } from '@/domain/restaurant/application/repositories/image-repository';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaBrothRepository } from './prisma/repositories/prisma-broth-repository';
import { PrismaImagesRepository } from './prisma/repositories/prisma-image-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: BrothsRepository,
      useClass: PrismaBrothRepository,
    },
    {
      provide: ImagesRepository,
      useClass: PrismaImagesRepository,
    },
  ],
  exports: [PrismaService, BrothsRepository, ImagesRepository],
})
export class DatabaseModule {}

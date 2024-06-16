import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository';
import { ImagesRepository } from '@/domain/restaurant/application/repositories/image-repository';
import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository';
import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaBrothsRepository } from './prisma/repositories/prisma-broth-repository';
import { PrismaImagesRepository } from './prisma/repositories/prisma-image-repository';
import { PrismaOrdersRepository } from './prisma/repositories/prisma-order-repository';
import { PrismaProteinsRepository } from './prisma/repositories/prisma-protein-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: BrothsRepository,
      useClass: PrismaBrothsRepository,
    },
    {
      provide: ProteinsRepository,
      useClass: PrismaProteinsRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
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
    OrdersRepository,
    ImagesRepository,
  ],
})
export class DatabaseModule {}

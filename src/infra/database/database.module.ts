import { Module } from '@nestjs/common'

import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository'
import { ImagesRepository } from '@/domain/restaurant/application/repositories/image-repository'
import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaBrothsRepository } from './prisma/repositories/restaurant/prisma-broth-repository'
import { PrismaImagesRepository } from './prisma/repositories/restaurant/prisma-image-repository'
import { PrismaOrdersRepository } from './prisma/repositories/restaurant/prisma-order-repository'
import { PrismaProteinsRepository } from './prisma/repositories/restaurant/prisma-protein-repository'

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

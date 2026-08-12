import { Module } from '@nestjs/common'

import { UsersRepository } from '@/domain/account/application/repositories/user-repository'
import { UserTokensRepository } from '@/domain/account/application/repositories/user-tokens-repository'
import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository'
import { ImagesRepository } from '@/domain/restaurant/application/repositories/image-repository'
import { OrdersRepository } from '@/domain/restaurant/application/repositories/order-repository'
import { ProteinsRepository } from '@/domain/restaurant/application/repositories/protein-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaUsersRepository } from './prisma/repositories/account/prisma-user-repository'
import { PrismaUserTokensRepository } from './prisma/repositories/account/prisma-user-token-repository'
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
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: UserTokensRepository,
      useClass: PrismaUserTokensRepository,
    },
  ],
  exports: [
    PrismaService,
    BrothsRepository,
    ProteinsRepository,
    OrdersRepository,
    ImagesRepository,
    UsersRepository,
    UserTokensRepository,
  ],
})
export class DatabaseModule {}

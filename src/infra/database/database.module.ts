import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { BrothsRepository } from '@/domain/restaurant/application/repositories/broth-repository';
import { PrismaBrothRepository } from './prisma/repositories/prisma-broth-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: BrothsRepository,
      useClass: PrismaBrothRepository,
    },
  ],
  exports: [PrismaService, BrothsRepository],
})
export class DatabaseModule {}

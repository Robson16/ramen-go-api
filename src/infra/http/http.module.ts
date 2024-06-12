import { CreateBrothUseCase } from '@/domain/restaurant/application/use-cases/broth-create.usecase';
import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';
import { CreateBrothController } from './controllers/restaurant/create-broth.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CreateBrothController],
  providers: [CreateBrothUseCase],
})
export class HttpModule {}

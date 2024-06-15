import { CreateBrothUseCase } from '@/domain/restaurant/application/use-cases/broth-create.usecase';
import { ListBrothUseCase } from '@/domain/restaurant/application/use-cases/broth-list.usecase';
import { CreateProteinUseCase } from '@/domain/restaurant/application/use-cases/protein-create.usecase';
import { UploadAndCreateImageUseCase } from '@/domain/restaurant/application/use-cases/upload-and-create-image.usecase';
import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { CreateBrothController } from './controllers/restaurant/create-broth.controller';
import { CreateProteinController } from './controllers/restaurant/create-protein.controller';
import { ListBrothController } from './controllers/restaurant/list-broth.controller';
import { UploadImageController } from './controllers/restaurant/upload-image.controller';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [
    CreateBrothController,
    ListBrothController,
    CreateProteinController,
    UploadImageController,
  ],
  providers: [
    CreateBrothUseCase,
    ListBrothUseCase,
    CreateProteinUseCase,
    UploadAndCreateImageUseCase,
  ],
})
export class HttpModule {}

import { CreateBrothUseCase } from '@/domain/restaurant/application/use-cases/broth-create.usecase';
import { CreateProteinUseCase } from '@/domain/restaurant/application/use-cases/protein-create.usecase';
import { UploadAndCreateImageUseCase } from '@/domain/restaurant/application/use-cases/upload-and-create-image.usecase';
import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { CreateBrothController } from './controllers/restaurant/create-broth.controller';
import { CreateProteinController } from './controllers/restaurant/create-protein.controller';
import { UploadImageController } from './controllers/restaurant/upload-image.controller';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [
    CreateBrothController,
    CreateProteinController,
    UploadImageController,
  ],
  providers: [
    CreateBrothUseCase,
    CreateProteinUseCase,
    UploadAndCreateImageUseCase,
  ],
})
export class HttpModule {}

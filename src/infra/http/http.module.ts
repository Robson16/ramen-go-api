import { Module } from '@nestjs/common'

import { CreateBrothUseCase } from '@/domain/restaurant/application/use-cases/broth-create.usecase'
import { ListBrothUseCase } from '@/domain/restaurant/application/use-cases/broth-list.usecase'
import { CreateOrderUseCase } from '@/domain/restaurant/application/use-cases/order-create.usecase'
import { GetOrderByIdUseCase } from '@/domain/restaurant/application/use-cases/order-get-by-id.usecase'
import { CreateProteinUseCase } from '@/domain/restaurant/application/use-cases/protein-create.usecase'
import { ListProteinUseCase } from '@/domain/restaurant/application/use-cases/protein-list.usecase'
import { UploadAndCreateImageUseCase } from '@/domain/restaurant/application/use-cases/upload-and-create-image.usecase'
import { DatabaseModule } from '@/infra/database/database.module'
import { StorageModule } from '@/infra/storage/storage.module'

import { CreateBrothController } from './controllers/restaurant/create-broth.controller'
import { CreateOrderController } from './controllers/restaurant/create-order.controller'
import { CreateProteinController } from './controllers/restaurant/create-protein.controller'
import { GetOrderController } from './controllers/restaurant/get-order.controller'
import { ListBrothController } from './controllers/restaurant/list-broth.controller'
import { ListProteinController } from './controllers/restaurant/list-protein.controller'
import { UploadImageController } from './controllers/restaurant/upload-image.controller'

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [
    CreateBrothController,
    ListBrothController,
    CreateProteinController,
    ListProteinController,
    CreateOrderController,
    GetOrderController,
    UploadImageController,
  ],
  providers: [
    CreateBrothUseCase,
    ListBrothUseCase,
    CreateProteinUseCase,
    ListProteinUseCase,
    CreateOrderUseCase,
    GetOrderByIdUseCase,
    UploadAndCreateImageUseCase,
  ],
})
export class HttpModule {}

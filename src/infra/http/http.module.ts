import { Module } from '@nestjs/common'

import { UserAuthenticateUseCase } from '@/domain/account/application/use-cases/user-authenticate.usecase'
import { UserDeleteUseCase } from '@/domain/account/application/use-cases/user-delete.usecase'
import { UserEditProfileUseCase } from '@/domain/account/application/use-cases/user-edit-profile.usecase'
import { UserGetProfileUseCase } from '@/domain/account/application/use-cases/user-get-profile.usecase'
import { UserListUseCase } from '@/domain/account/application/use-cases/user-list.usecase'
import { UserRegisterUseCase } from '@/domain/account/application/use-cases/user-register.usecase'
import { UserResetPasswordUseCase } from '@/domain/account/application/use-cases/user-reset-password.usecase'
import { UserSendPasswordResetUseCase } from '@/domain/account/application/use-cases/user-send-password-reset.usecase'
import { AdminGetMetricsUseCase } from '@/domain/restaurant/application/use-cases/admin-get-metrics.usecase'
import { BrothCreateUseCase } from '@/domain/restaurant/application/use-cases/broth-create.usecase'
import { BrothDeleteUseCase } from '@/domain/restaurant/application/use-cases/broth-delete.usecase'
import { BrothEditUseCase } from '@/domain/restaurant/application/use-cases/broth-edit.usecase'
import { BrothListUseCase } from '@/domain/restaurant/application/use-cases/broth-list.usecase'
import { ImageUploadAndCreateUseCase } from '@/domain/restaurant/application/use-cases/image-upload-and-create.usecase'
import { OrderCreateUseCase } from '@/domain/restaurant/application/use-cases/order-create.usecase'
import { OrderGetByIdUseCase } from '@/domain/restaurant/application/use-cases/order-get-by-id.usecase'
import { OrderListAllUseCase } from '@/domain/restaurant/application/use-cases/order-list-all.usecase'
import { OrderListByUserUseCase } from '@/domain/restaurant/application/use-cases/order-list-by-user.usecase'
import { OrderUpdateStatusUseCase } from '@/domain/restaurant/application/use-cases/order-update-status.usecase'
import { ProteinCreateUseCase } from '@/domain/restaurant/application/use-cases/protein-create.usecase'
import { ProteinDeleteUseCase } from '@/domain/restaurant/application/use-cases/protein-delete.usecase'
import { ProteinEditUseCase } from '@/domain/restaurant/application/use-cases/protein-edit.usecase'
import { ProteinListUseCase } from '@/domain/restaurant/application/use-cases/protein-list.usecase'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { MailModule } from '@/infra/mailing/mail.module'
import { StorageModule } from '@/infra/storage/storage.module'

import { UserAuthenticateController } from './controllers/account/user-authenticate.controller'
import { UserDeleteProfileController } from './controllers/account/user-delete-profile.controller'
import { UserEditProfileController } from './controllers/account/user-edit-profile.controller'
import { UserGetProfileController } from './controllers/account/user-get-profile.controller'
import { UserListController } from './controllers/account/user-list.controller'
import { UserRegisterController } from './controllers/account/user-register.controller'
import { UserResetPasswordController } from './controllers/account/user-reset-password.controller'
import { UserSendPasswordResetController } from './controllers/account/user-send-password-reset.controller'
import { AdminGetMetricsController } from './controllers/restaurant/admin-get-metrics.controller'
import { BrothCreateController } from './controllers/restaurant/broth-create.controller'
import { BrothDeleteController } from './controllers/restaurant/broth-delete.controller'
import { BrothEditController } from './controllers/restaurant/broth-edit.controller'
import { BrothListController } from './controllers/restaurant/broth-list.controller'
import { ImageUploadController } from './controllers/restaurant/image-upload.controller'
import { OrderCreateController } from './controllers/restaurant/order-create.controller'
import { OrderGetByIdController } from './controllers/restaurant/order-get-by-id.controller'
import { OrderListAllController } from './controllers/restaurant/order-list-all.controller'
import { OrderListByUserController } from './controllers/restaurant/order-list-user.controller'
import { OrderUpdateStatusController } from './controllers/restaurant/order-update-status.controller'
import { ProteinCreateController } from './controllers/restaurant/protein-create.controller'
import { ProteinDeleteController } from './controllers/restaurant/protein-delete.controller'
import { ProteinEditController } from './controllers/restaurant/protein-edit.controller'
import { ProteinListController } from './controllers/restaurant/protein-list.controller'

@Module({
  imports: [DatabaseModule, StorageModule, CryptographyModule, MailModule],
  controllers: [
    UserRegisterController,
    UserAuthenticateController,
    UserListController,
    UserGetProfileController,
    UserEditProfileController,
    UserDeleteProfileController,
    UserSendPasswordResetController,
    UserResetPasswordController,
    BrothCreateController,
    BrothListController,
    BrothEditController,
    BrothDeleteController,
    ProteinCreateController,
    ProteinListController,
    ProteinEditController,
    ProteinDeleteController,
    OrderCreateController,
    OrderGetByIdController,
    OrderListAllController,
    OrderListByUserController,
    OrderUpdateStatusController,
    ImageUploadController,
    AdminGetMetricsController,
  ],
  providers: [
    UserRegisterUseCase,
    UserAuthenticateUseCase,
    UserListUseCase,
    UserGetProfileUseCase,
    UserEditProfileUseCase,
    UserDeleteUseCase,
    UserSendPasswordResetUseCase,
    UserResetPasswordUseCase,
    BrothCreateUseCase,
    BrothListUseCase,
    BrothEditUseCase,
    BrothDeleteUseCase,
    ProteinCreateUseCase,
    ProteinEditUseCase,
    ProteinListUseCase,
    ProteinDeleteUseCase,
    OrderCreateUseCase,
    OrderGetByIdUseCase,
    OrderListAllUseCase,
    OrderListByUserUseCase,
    OrderUpdateStatusUseCase,
    ImageUploadAndCreateUseCase,
    AdminGetMetricsUseCase,
  ],
})
export class HttpModule {}

import { Module } from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/account/application/use-cases/user-authenticate.usecase'
import { DeleteUserUseCase } from '@/domain/account/application/use-cases/user-delete.usecase'
import { EditUserProfileUseCase } from '@/domain/account/application/use-cases/user-edit-profile.usecase'
import { GetUserProfileUseCase } from '@/domain/account/application/use-cases/user-get-profile.usecase'
import { ListUserUseCase } from '@/domain/account/application/use-cases/user-list.usecase'
import { RegisterUserUseCase } from '@/domain/account/application/use-cases/user-register.usecase'
import { ResetUserPasswordUseCase } from '@/domain/account/application/use-cases/user-reset-password.usecase'
import { SendUserPasswordResetUseCase } from '@/domain/account/application/use-cases/user-send-password-reset.usecase'
import { CreateBrothUseCase } from '@/domain/restaurant/application/use-cases/broth-create.usecase'
import { ListBrothUseCase } from '@/domain/restaurant/application/use-cases/broth-list.usecase'
import { CreateOrderUseCase } from '@/domain/restaurant/application/use-cases/order-create.usecase'
import { GetOrderByIdUseCase } from '@/domain/restaurant/application/use-cases/order-get-by-id.usecase'
import { CreateProteinUseCase } from '@/domain/restaurant/application/use-cases/protein-create.usecase'
import { ListProteinUseCase } from '@/domain/restaurant/application/use-cases/protein-list.usecase'
import { UploadAndCreateImageUseCase } from '@/domain/restaurant/application/use-cases/upload-and-create-image.usecase'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { MailModule } from '@/infra/mailing/mail.module'
import { StorageModule } from '@/infra/storage/storage.module'

import { AuthenticateUserController } from './controllers/account/authenticate-user.controller'
import { DeleteUserProfileController } from './controllers/account/delete-user-profile.controller'
import { EditUserProfileController } from './controllers/account/edit-user-profile.controller'
import { GetUserProfileController } from './controllers/account/get-user-profile.controller'
import { RegisterUserController } from './controllers/account/register-user.controller'
import { ResetUserPasswordController } from './controllers/account/reset-user-password.controller'
import { SendUserPasswordResetController } from './controllers/account/send-user-password-reset.controller'
import { ListUserController } from './controllers/admin/list-users.controller'
import { CreateBrothController } from './controllers/restaurant/create-broth.controller'
import { CreateOrderController } from './controllers/restaurant/create-order.controller'
import { CreateProteinController } from './controllers/restaurant/create-protein.controller'
import { GetOrderController } from './controllers/restaurant/get-order.controller'
import { ListBrothController } from './controllers/restaurant/list-broth.controller'
import { ListProteinController } from './controllers/restaurant/list-protein.controller'
import { UploadImageController } from './controllers/restaurant/upload-image.controller'

@Module({
  imports: [DatabaseModule, StorageModule, CryptographyModule, MailModule],
  controllers: [
    RegisterUserController,
    AuthenticateUserController,
    GetUserProfileController,
    EditUserProfileController,
    DeleteUserProfileController,
    SendUserPasswordResetController,
    ResetUserPasswordController,
    ListUserController,
    CreateBrothController,
    ListBrothController,
    CreateProteinController,
    ListProteinController,
    CreateOrderController,
    GetOrderController,
    UploadImageController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    GetUserProfileUseCase,
    EditUserProfileUseCase,
    DeleteUserUseCase,
    SendUserPasswordResetUseCase,
    ResetUserPasswordUseCase,
    ListUserUseCase,
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

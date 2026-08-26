import { Module } from '@nestjs/common'

import { UserAuthenticateUseCase } from '@/domain/account/application/use-cases/user-authenticate.usecase'
import { UserDeleteUseCase } from '@/domain/account/application/use-cases/user-delete.usecase'
import { UserEditProfileUseCase } from '@/domain/account/application/use-cases/user-edit-profile.usecase'
import { UserGetProfileUseCase } from '@/domain/account/application/use-cases/user-get-profile.usecase'
import { UserListUseCase } from '@/domain/account/application/use-cases/user-list.usecase'
import { UserRegisterUseCase } from '@/domain/account/application/use-cases/user-register.usecase'
import { UserResetPasswordUseCase } from '@/domain/account/application/use-cases/user-reset-password.usecase'
import { UserSendPasswordResetUseCase } from '@/domain/account/application/use-cases/user-send-password-reset.usecase'
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

import { AuthenticateUserController } from './controllers/account/authenticate-user.controller'
import { DeleteUserProfileController } from './controllers/account/delete-user-profile.controller'
import { EditUserProfileController } from './controllers/account/edit-user-profile.controller'
import { GetUserProfileController } from './controllers/account/get-user-profile.controller'
import { ListUsersController } from './controllers/account/list-users.controller'
import { RegisterUserController } from './controllers/account/register-user.controller'
import { ResetUserPasswordController } from './controllers/account/reset-user-password.controller'
import { SendUserPasswordResetController } from './controllers/account/send-user-password-reset.controller'
import { CreateBrothController } from './controllers/restaurant/create-broth.controller'
import { CreateOrderController } from './controllers/restaurant/create-order.controller'
import { CreateProteinController } from './controllers/restaurant/create-protein.controller'
import { DeleteBrothController } from './controllers/restaurant/delete-broth.controller'
import { DeleteProteinController } from './controllers/restaurant/delete-protein.controller'
import { EditBrothController } from './controllers/restaurant/edit-broth.controller'
import { EditProteinController } from './controllers/restaurant/edit-protein.controller'
import { GetOrderController } from './controllers/restaurant/get-order.controller'
import { ListAllOrdersController } from './controllers/restaurant/list-all-orders.controller'
import { ListBrothController } from './controllers/restaurant/list-broth.controller'
import { ListProteinController } from './controllers/restaurant/list-protein.controller'
import { ListOrdersByUserController } from './controllers/restaurant/list-user-orders.controller'
import { UpdateOrderStatusController } from './controllers/restaurant/update-order-status.controller'
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
    ListUsersController,
    CreateBrothController,
    ListBrothController,
    EditBrothController,
    DeleteBrothController,
    CreateProteinController,
    ListProteinController,
    EditProteinController,
    DeleteProteinController,
    CreateOrderController,
    GetOrderController,
    ListAllOrdersController,
    ListOrdersByUserController,
    UpdateOrderStatusController,
    UploadImageController,
  ],
  providers: [
    UserRegisterUseCase,
    UserAuthenticateUseCase,
    UserGetProfileUseCase,
    UserEditProfileUseCase,
    UserDeleteUseCase,
    UserSendPasswordResetUseCase,
    UserResetPasswordUseCase,
    UserListUseCase,
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
  ],
})
export class HttpModule {}

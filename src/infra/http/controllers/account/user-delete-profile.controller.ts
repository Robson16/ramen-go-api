import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserDeleteUseCase } from '@/domain/account/application/use-cases/user-delete.usecase'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@ApiTags('accounts')
@Controller('/profile')
@ApiBearerAuth()
export class UserDeleteProfileController {
  constructor(private deleteUserUseCase: UserDeleteUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete user profile.' })
  @ApiResponse({
    status: 204,
    description: 'User profile deleted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.deleteUserUseCase.execute({
      userId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException('An unexpected error occurred.')
      }
    }
  }
}

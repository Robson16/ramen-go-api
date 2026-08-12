import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GetUserProfileUseCase } from '@/domain/account/application/use-cases/user-get-profile.usecase'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UserPresenter } from '@/infra/http/presenters/account/user-presenter'

class UserProfileDto {
  @ApiProperty({ example: '1' })
  id: string = ''

  @ApiProperty({ example: 'John Doe' })
  name: string = ''

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string = ''

  @ApiProperty({ example: '2024-01-01T12:00:00.000Z' })
  createdAt: string = ''

  @ApiProperty({ example: '2024-01-01T12:00:00.000Z' })
  updatedAt: string = ''
}

@ApiTags('accounts')
@Controller('/profile')
@ApiBearerAuth()
export class GetUserProfileController {
  constructor(private getUserProfile: GetUserProfileUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Get the profile of the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved.',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.getUserProfile.execute({
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

    return {
      user: UserPresenter.toHTTP(result.value.user),
    }
  }
}

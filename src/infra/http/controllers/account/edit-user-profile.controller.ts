import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Put,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserAlreadyExistsError } from '@/domain/account/application/use-cases/errors/user-already-exists-error'
import { EditUserProfileUseCase } from '@/domain/account/application/use-cases/user-edit-profile.usecase'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const editProfileBodySchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
})

type EditProfileBodySchema = z.infer<typeof editProfileBodySchema>

class EditProfileDto {
  @ApiProperty({ example: 'John Doe', required: false })
  name?: string

  @ApiProperty({ example: 'john.doe@example.com', required: false })
  email?: string

  @ApiProperty({ example: '12345678', required: false })
  password?: string
}

@ApiTags('accounts')
@Controller('/profile')
@ApiBearerAuth()
export class EditUserProfileController {
  constructor(private editUserProfileUseCase: EditUserProfileUseCase) {}

  @Put()
  @HttpCode(204)
  @ApiOperation({ summary: 'Edit user profile.' })
  @ApiBody({ type: EditProfileDto })
  @ApiResponse({
    status: 204,
    description: 'User profile updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict. A user with this email already exists.',
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(editProfileBodySchema))
    body: EditProfileBodySchema,
  ) {
    const { name, email, password } = body

    const result = await this.editUserProfileUseCase.execute({
      userId: user.sub,
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException('An unexpected error occurred.')
      }
    }
  }
}

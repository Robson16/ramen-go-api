import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Patch,
  UsePipes,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { InvalidTokenError } from '@/domain/account/application/use-cases/errors/invalid-token-error'
import { UserResetPasswordUseCase } from '@/domain/account/application/use-cases/user-reset-password.usecase'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const userResetPasswordBodySchema = z.object({
  token: z.string().uuid(),
  password: z.string().min(8),
})

type UserResetPasswordBodySchema = z.infer<typeof userResetPasswordBodySchema>

class ResetUserPasswordDto {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: "The password reset token sent to the user's email.",
  })
  token: string = ''

  @ApiProperty({
    example: 'new_password_123',
    description:
      'The new password for the user. Must be at least 8 characters long.',
  })
  password: string = ''
}

@ApiTags('accounts')
@Controller('/password/reset')
@Public()
export class UserResetPasswordController {
  constructor(private resetUserPasswordUseCase: UserResetPasswordUseCase) {}

  @Patch()
  @HttpCode(204)
  @ApiOperation({ summary: 'Reset user password.' })
  @ApiBody({ type: ResetUserPasswordDto })
  @ApiResponse({ status: 204, description: 'Password reset successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid token or validation error.',
  })
  @UsePipes(new ZodValidationPipe(userResetPasswordBodySchema))
  async handle(@Body() body: UserResetPasswordBodySchema) {
    const { token, password } = body

    const result = await this.resetUserPasswordUseCase.execute({
      token,
      newPassword: password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case InvalidTokenError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException('An unexpected error occurred.')
      }
    }
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
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

import { UserSendPasswordResetUseCase } from '@/domain/account/application/use-cases/user-send-password-reset.usecase'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const userSendPasswordResetBodySchema = z.object({
  email: z.string().email(),
})

type UserSendPasswordResetBodySchema = z.infer<
  typeof userSendPasswordResetBodySchema
>

class SendUserPasswordResetDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user to reset the password for.',
  })
  email: string = ''
}

@ApiTags('accounts')
@Controller('/password/forgot')
@Public()
export class UserSendPasswordResetController {
  constructor(
    private sendUserPasswordResetUseCase: UserSendPasswordResetUseCase,
  ) {}

  @Post()
  @HttpCode(204)
  @ApiOperation({ summary: 'Send a password reset link to the user.' })
  @ApiBody({ type: SendUserPasswordResetDto })
  @ApiResponse({
    status: 204,
    description: 'Password reset link sent successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UsePipes(new ZodValidationPipe(userSendPasswordResetBodySchema))
  async handle(@Body() body: UserSendPasswordResetBodySchema) {
    const { email } = body

    const result = await this.sendUserPasswordResetUseCase.execute({
      email,
    })

    if (result.isLeft()) {
      throw new BadRequestException('An unexpected error occurred.')
    }
  }
}

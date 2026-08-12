import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { WrongCredentialsError } from '@/domain/account/application/use-cases/errors/wrong-credentials-error'
import { AuthenticateUserUseCase } from '@/domain/account/application/use-cases/user-authenticate.usecase'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

class AuthenticateDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string = ''

  @ApiProperty({ example: '12345678' })
  password: string = ''
}

@ApiTags('accounts')
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Authenticate a user and return a JWT.' })
  @ApiBody({ type: AuthenticateDto })
  @ApiResponse({ status: 201, description: 'User authenticated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Wrong credentials.' })
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateUser.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException('An unexpected error occurred.')
      }
    }

    // Se deu tudo certo, extraímos o token de dentro do result.value
    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}

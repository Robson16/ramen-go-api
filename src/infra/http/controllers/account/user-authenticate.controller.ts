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
import { UserAuthenticateUseCase } from '@/domain/account/application/use-cases/user-authenticate.usecase'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const userAuthenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type UserAuthenticateBodySchema = z.infer<typeof userAuthenticateBodySchema>

class AuthenticateDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string = ''

  @ApiProperty({ example: '12345678' })
  password: string = ''
}

class AuthenticateResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'The JWT access token.',
  })
  access_token: string = ''
}

@ApiTags('accounts')
@Controller('/sessions')
@Public()
export class UserAuthenticateController {
  constructor(private authenticateUserUseCase: UserAuthenticateUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Authenticate a user and return a JWT.' })
  @ApiBody({ type: AuthenticateDto })
  @ApiResponse({
    status: 201,
    description: 'User authenticated successfully.',
    type: AuthenticateResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Wrong credentials.' })
  @UsePipes(new ZodValidationPipe(userAuthenticateBodySchema))
  async handle(@Body() body: UserAuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateUserUseCase.execute({
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

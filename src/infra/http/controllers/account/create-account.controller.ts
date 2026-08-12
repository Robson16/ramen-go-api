import {
  BadRequestException,
  Body,
  ConflictException,
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
import { z } from 'zod'

import { UserAlreadyExistsError } from '@/domain/account/application/use-cases/errors/user-already-exists-error'
import { RegisterUserUseCase } from '@/domain/account/application/use-cases/user-register.usecase'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

class CreateAccountDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user.',
  })
  name: string = ''

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'A valid email address.',
  })
  email: string = ''

  @ApiProperty({
    example: '12345678',
    description: 'A strong password with at least 8 characters.',
  })
  password: string = ''
}

@ApiTags('accounts')
@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user account.' })
  @ApiBody({ type: CreateAccountDto, description: 'Account creation payload' })
  @ApiResponse({ status: 201, description: 'Account created successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Validation failed. Data is invalid.',
  })
  @ApiResponse({
    status: 409,
    description: 'ConflictException. A user with this email already exists.',
  })
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const result = await this.registerUser.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException('An unexpected error occurred.')
      }
    }
  }
}

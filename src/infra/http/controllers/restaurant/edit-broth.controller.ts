import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
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
import { EditBrothUseCase } from '@/domain/restaurant/application/use-cases/broth-edit.usecase'
import { BrothAlreadyExistsError } from '@/domain/restaurant/application/use-cases/errors/broth-already-exists-error'
import { Roles } from '@/infra/auth/roles-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const editBrothBodySchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  imageActiveId: z.string().uuid().optional(),
  imageInactiveId: z.string().uuid().optional(),
})

type EditBrothBodySchema = z.infer<typeof editBrothBodySchema>

class EditBrothDto {
  @ApiProperty({ example: 'Shoyu', required: false })
  name?: string

  @ApiProperty({
    example: 'A rich and savory chicken broth.',
    required: false,
  })
  description?: string

  @ApiProperty({ example: 10, required: false })
  price?: number

  @ApiProperty({
    example: '16b8aee3-90c8-4f42-83cd-7b01e6db30a0',
    required: false,
  })
  imageActiveId?: string

  @ApiProperty({
    example: '16b8aee3-90c8-4f42-83cd-7b01e6db30a0',
    required: false,
  })
  imageInactiveId?: string
}

@ApiTags('admin', 'restaurant', 'broths')
@ApiBearerAuth()
@Controller('/broths')
export class EditBrothController {
  constructor(private editBrothUseCase: EditBrothUseCase) {}

  @Put(':brothId')
  @Roles('ADMIN')
  @HttpCode(204)
  @ApiOperation({ summary: 'Edit a broth.' })
  @ApiBody({ type: EditBrothDto, description: 'The broth update payload' })
  @ApiResponse({
    status: 204,
    description: 'The broth has been updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or an unexpected error occurred.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing Bearer token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admin users can edit a broth.',
  })
  @ApiResponse({
    status: 404,
    description: 'The broth or one of its images was not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'A broth with the same name already exists.',
  })
  async handle(
    @Param('brothId') brothId: string,
    @Body(new ZodValidationPipe(editBrothBodySchema))
    body: EditBrothBodySchema,
  ) {
    const { name, description, price, imageActiveId, imageInactiveId } = body

    const result = await this.editBrothUseCase.execute({
      brothId,
      name,
      description,
      price,
      imageActiveId,
      imageInactiveId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case BrothAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException('An unexpected error occurred.')
      }
    }
  }
}

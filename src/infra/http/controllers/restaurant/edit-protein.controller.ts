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
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ProteinAlreadyExistsError } from '@/domain/restaurant/application/use-cases/errors/protein-already-exists-error'
import { EditProteinUseCase } from '@/domain/restaurant/application/use-cases/protein-edit'
import { Roles } from '@/infra/auth/roles-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const editProteinBodySchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  imageActiveId: z.string().uuid().optional(),
  imageInactiveId: z.string().uuid().optional(),
})

type EditProteinBodySchema = z.infer<typeof editProteinBodySchema>

class EditProteinDto {
  @ApiProperty({ example: 'Chasu', required: false })
  name?: string

  @ApiProperty({
    example: 'A sliced flavourful pork meat with vegetables.',
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

@ApiTags('admin', 'restaurant', 'proteins')
@ApiBearerAuth()
@Controller('/proteins')
export class EditProteinController {
  constructor(private editProteinUseCase: EditProteinUseCase) {}

  @Put(':proteinId')
  @Roles('ADMIN')
  @HttpCode(204)
  @ApiOperation({ summary: 'Edit a protein.' })
  @ApiParam({
    name: 'proteinId',
    description: 'The unique identifier of the protein.',
    example: 'ec82a6b8-ea86-4543-a286-809672bcc423',
  })
  @ApiBody({ type: EditProteinDto, description: 'The protein update payload' })
  @ApiResponse({
    status: 204,
    description: 'The protein has been updated successfully.',
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
    description: 'Forbidden. Only admin users can edit a protein.',
  })
  @ApiResponse({
    status: 404,
    description: 'The protein or one of its images was not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'A protein with the same name already exists.',
  })
  async handle(
    @Param('proteinId') proteinId: string,
    @Body(new ZodValidationPipe(editProteinBodySchema))
    body: EditProteinBodySchema,
  ) {
    const { name, description, price, imageActiveId, imageInactiveId } = body

    const result = await this.editProteinUseCase.execute({
      proteinId,
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
        case ProteinAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException('An unexpected error occurred.')
      }
    }
  }
}

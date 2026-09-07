import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ImageGetByIdUseCase } from '@/domain/media/application/use-cases/image-get-by-id.usecase'
import { Roles } from '@/infra/auth/roles-decorator'
import { ImagePresenter } from '@/infra/http/presenters/media/image-presenter'

@ApiTags('Media (Admin)')
@ApiBearerAuth()
@Controller('/admin/images/:id')
export class ImageGetByIdController {
  constructor(private getById: ImageGetByIdUseCase) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get an image by ID' })
  @ApiResponse({
    status: 200,
    description: 'The image details.',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            url: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
      },
      example: {
        image: {
          id: '16b8aee3-90c8-4f42-83cd-7b01e6db30a0',
          title: 'tonkotsu-icon.svg',
          url: 'a286-809672bcc423-tonkotsu-icon.svg',
          createdAt: '2026-09-07T12:00:00.000Z',
          updatedAt: null,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiResponse({
    status: 404,
    description: 'Image not found.',
  })
  async handle(@Param('id') imageId: string) {
    const result = await this.getById.execute({
      imageId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException('An unexpected error occurred.')
      }
    }

    return {
      image: ImagePresenter.toHTTP(result.value.image),
    }
  }
}

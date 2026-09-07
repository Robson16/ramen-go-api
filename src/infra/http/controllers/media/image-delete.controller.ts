import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ResourceInUseError } from '@/core/errors/resource-in-use-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ImageDeleteUseCase } from '@/domain/media/application/use-cases/image-delete.usecase'
import { Roles } from '@/infra/auth/roles-decorator'

@ApiTags('Media (Admin)')
@ApiBearerAuth()
@Controller('/admin/images/:id')
export class ImageDeleteController {
  constructor(private deleteImage: ImageDeleteUseCase) {}

  @Delete()
  @HttpCode(204)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete an image from the gallery' })
  @ApiResponse({
    status: 204,
    description: 'The image has been successfully deleted.',
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
  @ApiResponse({
    status: 409,
    description:
      'Conflict. The image cannot be deleted because it is being used.',
  })
  async handle(@Param('id') imageId: string) {
    const result = await this.deleteImage.execute({
      imageId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case ResourceInUseError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException('An unexpected error occurred.')
      }
    }
  }
}

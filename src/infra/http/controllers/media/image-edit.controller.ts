import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ImageEditUseCase } from '@/domain/media/application/use-cases/image-edit.usecase'
import { Roles } from '@/infra/auth/roles-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ImagePresenter } from '@/infra/http/presenters/media/image-presenter'

const editImageBodySchema = z.object({
  title: z.string().min(1, 'Title is required'),
})

type EditImageBodySchema = z.infer<typeof editImageBodySchema>

@ApiTags('Media (Admin)')
@ApiBearerAuth()
@Controller('/admin/images/:id')
export class ImageEditController {
  constructor(private editImage: ImageEditUseCase) {}

  @Patch()
  @HttpCode(200)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Edit an image title' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'new-title-for-icon.png' },
      },
      required: ['title'],
    },
  })
  @ApiResponse({ status: 200, description: 'The updated image.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  async handle(
    @Param('id') imageId: string,
    @Body(new ZodValidationPipe(editImageBodySchema))
    body: EditImageBodySchema,
  ) {
    const { title } = body

    const result = await this.editImage.execute({
      imageId,
      title,
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

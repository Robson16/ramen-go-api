import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { ImageFetchGalleryUseCase } from '@/domain/media/application/use-cases/image-fetch-gallery.usecase'
import { Roles } from '@/infra/auth/roles-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ImagePresenter } from '@/infra/http/presenters/media/image-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Media (Admin)')
@ApiBearerAuth()
@Controller('/admin/images')
export class ImageFetchGalleryController {
  constructor(private fetchGallery: ImageFetchGalleryUseCase) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Fetch media gallery images' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of images.',
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              title: { type: 'string' },
              url: { type: 'string' },
            },
          },
        },
      },
      example: {
        images: [
          {
            id: '16b8aee3-90c8-4f42-83cd-7b01e6db30a0',
            title: 'tonkotsu-icon.svg',
            url: 'a286-809672bcc423-tonkotsu-icon.svg',
          },
          {
            id: 'ec82a6b8-ea86-4543-a286-809672bcc423',
            title: 'ramen-bowl-success.png',
            url: 'ec82a6b8-ea86-4543-a286-809672bcc423-ramen-bowl-success.png',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admin users can access.',
  })
  @UsePipes(new ZodValidationPipe(pageQueryParamSchema))
  async handle(@Query('page') page: PageQueryParamSchema) {
    const result = await this.fetchGallery.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const images = result.value.images

    return {
      images: images.map(ImagePresenter.toHTTP),
    }
  }
}

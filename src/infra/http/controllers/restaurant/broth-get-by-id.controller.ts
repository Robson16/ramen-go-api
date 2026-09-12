import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { BrothGetByIdUseCase } from '@/domain/restaurant/application/use-cases/broth-get-by-id'
import { BrothPresenter } from '@/infra/http/presenters/restaurant/broth-presenter'

@ApiTags('Catalog')
@ApiBearerAuth()
@Controller('/broths')
export class BrothGetByIdController {
  constructor(private getBrothById: BrothGetByIdUseCase) {}

  @Get(':brothId')
  @ApiOperation({ summary: 'Get an broth by ID.' })
  @ApiParam({
    name: 'brothId',
    description: 'The unique identifier of the broth',
    example: 'ec82a6b8-ea86-4543-a286-809672bcc423',
  })
  @ApiResponse({
    status: 200,
    description: 'The broth details.',
    schema: {
      example: {
        broth: {
          id: 'ec82a6b8-ea86-4543-a286-809672bcc423',
          name: 'Tonkotsu',
          description: 'Rich pork bone broth with creamy flavor.',
          price: 14.5,
          imageActive: {
            id: 'd9b2d63d-a233-4123-8478-43552233fa21',
            url: 'https://test-bucket.r2.dev/active-1.svg',
          },
          imageInactive: {
            id: 'e4f1a63d-c122-4113-9578-12552233ff99',
            url: 'https://test-bucket.r2.dev/inactive-1.svg',
          },
          createdAt: '2026-09-11T14:30:00.000Z',
          updatedAt: null,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing Bearer token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Broth not found in database.',
  })
  async handle(@Param('brothId') brothId: string) {
    const result = await this.getBrothById.execute({
      brothId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException('An unexpected error occurred.')
      }
    }

    const { broth } = result.value

    return {
      broth: BrothPresenter.toHTTP(broth),
    }
  }
}

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
import { ProteinGetByIdUseCase } from '@/domain/restaurant/application/use-cases/protein-get-by-id'
import { ProteinPresenter } from '@/infra/http/presenters/restaurant/protein-presenter'

@ApiTags('Catalog')
@ApiBearerAuth()
@Controller('/proteins')
export class ProteinGetByIdController {
  constructor(private getProteinById: ProteinGetByIdUseCase) {}

  @Get(':proteinId')
  @ApiOperation({ summary: 'Get an protein by ID.' })
  @ApiParam({
    name: 'proteinId',
    description: 'The unique identifier of the protein',
    example: 'ec82a6b8-ea86-4543-a286-809672bcc423',
  })
  @ApiResponse({
    status: 200,
    description: 'The protein details.',
    schema: {
      example: {
        protein: {
          id: 'ec82a6b8-ea86-4543-a286-809672bcc423',
          name: 'Chasu',
          description:
            'A sliced flavourful pork meat with a selection of season vegetables.',
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
    description: 'Protein not found in database.',
  })
  async handle(@Param('proteinId') proteinId: string) {
    const result = await this.getProteinById.execute({
      proteinId,
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

    const { protein } = result.value

    return {
      protein: ProteinPresenter.toHTTP(protein),
    }
  }
}

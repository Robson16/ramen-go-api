import { BadRequestException, Controller, Get } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ProteinListUseCase } from '@/domain/restaurant/application/use-cases/protein-list.usecase'
import { ProteinPresenter } from '@/infra/http/presenters/restaurant/protein-presenter'

@ApiTags('Catalog (Public)')
@ApiBearerAuth()
@Controller('/proteins')
export class ProteinListController {
  constructor(private listProtein: ProteinListUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List Protein.' })
  @ApiResponse({
    status: 200,
    description: 'A list of proteins.',
    schema: {
      type: 'object',
      properties: {
        proteins: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string', example: 'Chasu' },
              description: { type: 'string', example: 'Sliced pork meat.' },
              price: { type: 'number', example: 10 },
              imageActive: { type: 'string', format: 'uri' },
              imageInactive: { type: 'string', format: 'uri' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
              },
            },
          },
        },
      },
      example: {
        proteins: [
          {
            id: '16b8aee3-90c8-4f42-83cd-7b01e6db30a0',
            name: 'Chasu',
            description: 'Sliced pork meat.',
            price: 10,
            imageActive: 'https://example.com/active.svg',
            imageInactive: 'https://example.com/inactive.svg',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: '2024-01-01T12:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing Bearer token.',
  })
  async handle() {
    const result = await this.listProtein.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const proteins = result.value.proteins

    return {
      proteins: proteins.map(ProteinPresenter.toHTTP),
    }
  }
}

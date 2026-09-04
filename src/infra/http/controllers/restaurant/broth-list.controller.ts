import { BadRequestException, Controller, Get } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { BrothListUseCase } from '@/domain/restaurant/application/use-cases/broth-list.usecase'
import { BrothPresenter } from '@/infra/http/presenters/restaurant/broth-presenter'

@ApiTags('Catalog (Public)')
@ApiBearerAuth()
@Controller('/broths')
export class BrothListController {
  constructor(private listBroth: BrothListUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List Broth.' })
  @ApiResponse({
    status: 200,
    description: 'A list of broths.',
    schema: {
      type: 'object',
      properties: {
        broths: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string', example: 'Shoyu' },
              description: { type: 'string', example: 'A rich broth.' },
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
        broths: [
          {
            id: '16b8aee3-90c8-4f42-83cd-7b01e6db30a0',
            name: 'Shoyu',
            description: 'A rich broth.',
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
    const result = await this.listBroth.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const broths = result.value.broths

    return {
      broths: broths.map(BrothPresenter.toHTTP),
    }
  }
}

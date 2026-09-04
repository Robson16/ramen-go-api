import { BadRequestException, Controller, Get } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { OrderListAllUseCase } from '@/domain/restaurant/application/use-cases/order-list-all.usecase'
import { Roles } from '@/infra/auth/roles-decorator'
import { OrderPresenter } from '@/infra/http/presenters/restaurant/order-presenter'

@ApiTags('Orders (Admin)')
@ApiBearerAuth()
@Controller('/admin/orders')
export class OrderListAllController {
  constructor(private listOrder: OrderListAllUseCase) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List All Orders' })
  @ApiResponse({
    status: 200,
    description: 'A list of all orders for admin.',
    schema: {
      type: 'object',
      properties: {
        orders: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              description: { type: 'string', example: 'New order' },
              status: { type: 'string', example: 'PENDING' },
              createdAt: { type: 'string', format: 'date-time' },
              broth: {
                type: 'object',
                properties: { name: { type: 'string', example: 'Shoyu' } },
              },
              protein: {
                type: 'object',
                properties: { name: { type: 'string', example: 'Chasu' } },
              },
              user: {
                type: 'object',
                properties: { name: { type: 'string', example: 'John Doe' } },
              },
            },
          },
        },
      },
      example: {
        orders: [
          {
            id: '16b8aee3-90c8-4f42-83cd-7b01e6db30a0',
            description: 'New order',
            status: 'PENDING',
            createdAt: '2024-01-01T12:00:00.000Z',
            broth: { name: 'Shoyu' },
            protein: { name: 'Chasu' },
            user: { name: 'John Doe' },
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
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admin users can list all orders.',
  })
  async handle() {
    const result = await this.listOrder.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return {
      orders: orders.map(OrderPresenter.toHTTP),
    }
  }
}

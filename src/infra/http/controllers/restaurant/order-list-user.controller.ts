import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { OrderListByUserUseCase } from '@/domain/restaurant/application/use-cases/order-list-by-user.usecase'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { OrderPresenter } from '@/infra/http/presenters/restaurant/order-presenter'

@ApiTags('Orders (Public)')
@ApiBearerAuth()
@Controller('/orders')
export class OrderListByUserController {
  constructor(private listOrdersByUser: OrderListByUserUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List the orders of the authenticated user.' })
  @ApiResponse({
    status: 200,
    description: 'The user orders.',
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.listOrdersByUser.execute({
      userId: user.sub,
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

    return {
      orders: result.value.orders.map(OrderPresenter.toHTTP),
    }
  }
}

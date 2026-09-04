import {
  BadRequestException,
  Controller,
  ForbiddenException,
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

import { ForbiddenError } from '@/core/errors/forbidden-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { OrderGetByIdUseCase } from '@/domain/restaurant/application/use-cases/order-get-by-id.usecase'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { OrderPresenter } from '@/infra/http/presenters/restaurant/order-presenter'

@ApiTags('Orders (Public)')
@ApiBearerAuth()
@Controller('/orders')
export class OrderGetByIdController {
  constructor(private getOrderById: OrderGetByIdUseCase) {}

  @Get(':orderId')
  @ApiOperation({ summary: 'Get an order by ID.' })
  @ApiParam({
    name: 'orderId',
    description: 'The unique identifier of the order',
    example: 'ec82a6b8-ea86-4543-a286-809672bcc423',
  })
  @ApiResponse({
    status: 200,
    description: 'The order details.',
    schema: {
      type: 'object',
      properties: {
        order: {
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
      example: {
        order: {
          id: '16b8aee3-90c8-4f42-83cd-7b01e6db30a0',
          description: 'New order',
          status: 'PENDING',
          createdAt: '2024-01-01T12:00:00.000Z',
          broth: { name: 'Shoyu' },
          protein: { name: 'Chasu' },
          user: { name: 'John Doe' },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing Bearer token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only the order owner or an admin can access it.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found in database.',
  })
  async handle(
    @Param('orderId') orderId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.getOrderById.execute({
      orderId,
      userId: user.sub,
      role: user.role,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ForbiddenError:
          throw new ForbiddenException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException('An unexpected error occurred.')
      }
    }

    const { order } = result.value

    return {
      order: OrderPresenter.toHTTP(order),
    }
  }
}

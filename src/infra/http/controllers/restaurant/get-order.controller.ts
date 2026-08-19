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
import { GetOrderByIdUseCase } from '@/domain/restaurant/application/use-cases/order-get-by-id.usecase'
import { OrderPresenter } from '@/infra/http/presenters/restaurant/order-presenter'

@ApiTags('orders')
@ApiBearerAuth()
@Controller('/orders')
export class GetOrderController {
  constructor(private getOrderById: GetOrderByIdUseCase) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID.' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the order',
    example: 'ec82a6b8-ea86-4543-a286-809672bcc423',
  })
  @ApiResponse({ status: 200, description: 'The order details.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing Bearer token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found in database.',
  })
  async handle(@Param('id') id: string) {
    const result = await this.getOrderById.execute({
      orderId: id,
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

    const { order } = result.value

    return OrderPresenter.toHTTP(order)
  }
}

import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { OrderUpdateStatusUseCase } from '@/domain/restaurant/application/use-cases/order-update-status.usecase'
import { OrderAlreadyDeliveredError } from '@/domain/restaurant/enterprise/entities/errors/order-already-delivered-error'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles-decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PREPARING', 'READY', 'DELIVERED']),
})

type UpdateOrderStatusSchema = z.infer<typeof updateOrderStatusSchema>

class UpdateOrderStatusDto {
  @ApiProperty({
    enum: ['PENDING', 'PREPARING', 'READY', 'DELIVERED'],
    example: 'PREPARING',
    description: 'The new status for the order.',
  })
  status: UpdateOrderStatusSchema['status'] = 'PENDING'
}

@ApiTags('admin', 'restaurant', 'orders')
@ApiBearerAuth()
@Controller('/orders/:orderId/status')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderUpdateStatusController {
  constructor(private updateOrderStatus: OrderUpdateStatusUseCase) {}

  @Patch()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update the status of an order.' })
  @ApiParam({
    name: 'orderId',
    description: 'The unique identifier of the order.',
    example: 'ec82a6b8-ea86-4543-a286-809672bcc423',
  })
  @ApiBody({
    type: UpdateOrderStatusDto,
    description: 'The order status update payload.',
  })
  @ApiResponse({
    status: 204,
    description: 'Order status updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or an unexpected error occurred.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing Bearer token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admin users can update order status.',
  })
  @ApiResponse({ status: 404, description: 'Order not found in database.' })
  @ApiResponse({
    status: 409,
    description: 'The order has already been delivered.',
  })
  @HttpCode(204)
  async handle(
    @Param('orderId') orderId: string,
    @Body(new ZodValidationPipe(updateOrderStatusSchema))
    body: UpdateOrderStatusSchema,
  ) {
    const { status } = body

    const result = await this.updateOrderStatus.execute({
      orderId,
      newStatus: status,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case OrderAlreadyDeliveredError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException('An unexpected error occurred.')
      }
    }
  }
}

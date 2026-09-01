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

@ApiTags('Orders')
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

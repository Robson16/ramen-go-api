import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { OrderCreateUseCase } from '@/domain/restaurant/application/use-cases/order-create.usecase'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { OrderPresenter } from '../../presenters/restaurant/order-presenter'

const orderCreateBodySchema = z.object({
  brothId: z.string().uuid(),
  proteinId: z.string().uuid(),
})

type OrderCreateBodySchema = z.infer<typeof orderCreateBodySchema>

class CreateOrderDto {
  @ApiProperty({
    example: 'ec82a6b8-ea86-4543-a286-809672bcc423',
    description: 'The ID for Broth',
  })
  brothId: string = ''

  @ApiProperty({
    example: '44172ba7-57d6-472f-a517-4c2d85d0219b',
    description: 'The ID for Protein',
  })
  proteinId: string = ''
}

@ApiTags('Orders (Public)')
@ApiBearerAuth()
@Controller('/orders')
export class OrderCreateController {
  constructor(private createOrder: OrderCreateUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a Order.' })
  @ApiBody({ type: CreateOrderDto, description: 'The order creation payload' })
  @ApiResponse({ status: 201, description: 'A new order has been created.' })
  @ApiResponse({
    status: 400,
    description:
      'Validation failed. Some data is invalid or has not been provided.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing Bearer token.',
  })
  @ApiResponse({
    status: 404,
    description: 'NotFoundException. Broth or Protein not found in database.',
  })
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(orderCreateBodySchema))
    body: OrderCreateBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { brothId, proteinId } = body

    const result = await this.createOrder.execute({
      userId: user.sub,
      brothId,
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

    const { order } = result.value

    return {
      order: OrderPresenter.toHTTP(order),
    }
  }
}

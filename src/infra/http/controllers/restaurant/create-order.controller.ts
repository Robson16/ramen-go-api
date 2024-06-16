import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { CreateOrderUseCase } from '@/domain/restaurant/application/use-cases/order-create.usecase';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { z } from 'zod';
import { OrderPresenter } from '../../presenters/order-presenter';

const createOrderBodySchema = z.object({
  brothId: z.string().uuid(),
  proteinId: z.string().uuid(),
});

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>;

class CreateOrder {
  @ApiProperty({
    example: 'ec82a6b8-ea86-4543-a286-809672bcc423',
    description: 'The ID for Broth',
  })
  brothId: string = '';

  @ApiProperty({
    example: '44172ba7-57d6-472f-a517-4c2d85d0219b',
    description: 'The ID for Protein',
  })
  proteinId: string = '';
}

@ApiTags('orders')
@ApiSecurity('api-key')
@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a Order.' })
  @ApiBody({ type: CreateOrder, description: 'The order creation payload' })
  @ApiResponse({ status: 201, description: 'A new order has been created.' })
  @ApiResponse({
    status: 400,
    description:
      'Validation failed. Some data is invalid or has not been provided.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid API Key.' })
  @ApiResponse({
    status: 404,
    description: 'NotFoundException. Broth or Protein not found in database.',
  })
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createOrderBodySchema))
  async handle(@Body() body: CreateOrderBodySchema) {
    const { brothId, proteinId } = body;

    const result = await this.createOrder.execute({
      brothId,
      proteinId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException('An unexpected error occurred.');
      }
    }

    const { order } = result.value;

    return OrderPresenter.toHTTP(order);
  }
}

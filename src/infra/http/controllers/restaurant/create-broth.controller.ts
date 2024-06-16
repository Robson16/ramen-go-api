import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { CreateBrothUseCase } from '@/domain/restaurant/application/use-cases/broth-create.usecase';
import { BrothAlreadyExistsError } from '@/domain/restaurant/application/use-cases/errors/broth-already-exists-error';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  ConflictException,
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

const createBrothBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  imageActiveId: z.string().uuid(),
  imageInactiveId: z.string().uuid(),
});

type CreateBrothBodySchema = z.infer<typeof createBrothBodySchema>;

class CreateBroth {
  @ApiProperty({
    example: 'Shoyu',
    description: 'The name of the broth',
  })
  name: string = '';

  @ApiProperty({
    example: 'A rich and savory chicken broth.',
    description: 'The description of the broth',
  })
  description: string = '';

  @ApiProperty({
    example: 10,
    description: 'The price of the broth',
  })
  price: number = 10;

  @ApiProperty({
    example: '16b8aee3-90c8-4f42-83cd-7b01e6db30a0',
    description:
      'The ID for an image that will represents a Active icon for the front-end.',
  })
  imageActiveId: string = '';

  @ApiProperty({
    example: '16b8aee3-90c8-4f42-83cd-7b01e6db30a0',
    description:
      'The ID for an image that will represents a Inactive icon for the front-end.',
  })
  imageInactiveId: string = '';
}

@ApiTags('broths')
@ApiSecurity('api-key')
@Controller('/broths')
export class CreateBrothController {
  constructor(private createBroth: CreateBrothUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a Broth.' })
  @ApiBody({ type: CreateBroth, description: 'The broth creation payload' })
  @ApiResponse({ status: 201, description: 'A new broth has been created.' })
  @ApiResponse({
    status: 400,
    description:
      'Validation failed. Some data is invalid or has not been provided.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid API Key.' })
  @ApiResponse({
    status: 404,
    description:
      'NotFoundException. Some of the images were not found in the database.',
  })
  @ApiResponse({
    status: 409,
    description:
      'ConflictException. A broth with the same name already exists.',
  })
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createBrothBodySchema))
  async handle(@Body() body: CreateBrothBodySchema) {
    const { name, description, price, imageActiveId, imageInactiveId } = body;

    const result = await this.createBroth.execute({
      name,
      description,
      price,
      imageActiveId,
      imageInactiveId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case BrothAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException('An unexpected error occurred.');
      }
    }
  }
}

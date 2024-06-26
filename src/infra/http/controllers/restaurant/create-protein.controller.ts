import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ProteinAlreadyExistsError } from '@/domain/restaurant/application/use-cases/errors/protein-already-exists-error';
import { CreateProteinUseCase } from '@/domain/restaurant/application/use-cases/protein-create.usecase';
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

const createProteinBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  imageActiveId: z.string().uuid(),
  imageInactiveId: z.string().uuid(),
});

type CreateProteinBodySchema = z.infer<typeof createProteinBodySchema>;

class CreateProtein {
  @ApiProperty({
    example: 'Chasu',
    description: 'The name of the protein',
  })
  name: string = '';

  @ApiProperty({
    example:
      'A sliced flavourful pork meat with a selection of season vegetables.',
    description: 'The description of the protein',
  })
  description: string = '';

  @ApiProperty({
    example: 10,
    description: 'The price of the protein',
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

@ApiTags('proteins')
@ApiSecurity('api-key')
@Controller('/proteins')
export class CreateProteinController {
  constructor(private createProtein: CreateProteinUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a Protein.' })
  @ApiBody({ type: CreateProtein, description: 'The protein creation payload' })
  @ApiResponse({ status: 201, description: 'A new protein has been created.' })
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
      'ConflictException. A protein with the same name already exists.',
  })
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createProteinBodySchema))
  async handle(@Body() body: CreateProteinBodySchema) {
    const { name, description, price, imageActiveId, imageInactiveId } = body;

    const result = await this.createProtein.execute({
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
        case ProteinAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException('An unexpected error occurred.');
      }
    }
  }
}

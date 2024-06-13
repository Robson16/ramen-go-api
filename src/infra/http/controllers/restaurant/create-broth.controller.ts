import { CreateBrothUseCase } from '@/domain/restaurant/application/use-cases/broth-create.usecase';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { z } from 'zod';

const createBrothBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
});

type CreateBrothBodySchema = z.infer<typeof createBrothBodySchema>;

class CreateBroth {
  @ApiProperty({
    example: 'Shoyu',
    description: 'The name of the broth',
  })
  name: string = '';

  @ApiProperty({
    example: 'A rich and savory chicken broth',
    description: 'The description of the broth',
  })
  description: string = '';

  @ApiProperty({
    example: 10,
    description: 'The price of the broth',
  })
  price: number = 10;
}

@ApiTags('broths')
@Controller('/broths')
export class CreateBrothController {
  constructor(private createBroth: CreateBrothUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a Broth.' })
  @ApiBody({ type: CreateBroth, description: 'The broth creation payload' })
  @ApiResponse({ status: 201, description: 'A new broth has been created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createBrothBodySchema))
  async handle(@Body() body: CreateBrothBodySchema) {
    const { name, description, price } = body;

    const result = await this.createBroth.execute({
      name,
      description,
      price,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
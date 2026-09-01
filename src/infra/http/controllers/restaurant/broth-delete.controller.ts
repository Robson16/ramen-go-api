import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
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
import { BrothDeleteUseCase } from '@/domain/restaurant/application/use-cases/broth-delete.usecase'
import { Roles } from '@/infra/auth/roles-decorator'

@ApiTags('Catalog (Admin)')
@ApiBearerAuth()
@Controller('/broths')
export class BrothDeleteController {
  constructor(private deleteBrothUseCase: BrothDeleteUseCase) {}

  @Delete(':brothId')
  @Roles('ADMIN')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a broth.' })
  @ApiParam({
    name: 'brothId',
    description: 'The unique identifier of the broth',
    example: 'ec82a6b8-ea86-4543-a286-809672bcc423',
  })
  @ApiResponse({
    status: 204,
    description: 'The broth has been deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'An unexpected error occurred.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing Bearer token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admin users can delete a broth.',
  })
  @ApiResponse({
    status: 404,
    description: 'Broth not found.',
  })
  async handle(@Param('brothId') brothId: string) {
    const result = await this.deleteBrothUseCase.execute({
      brothId,
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
  }
}

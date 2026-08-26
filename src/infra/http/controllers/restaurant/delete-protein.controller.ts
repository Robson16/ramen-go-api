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
import { ProteinDeleteUseCase } from '@/domain/restaurant/application/use-cases/protein-delete.usecase'
import { Roles } from '@/infra/auth/roles-decorator'

@ApiTags('admin', 'restaurant', 'proteins')
@ApiBearerAuth()
@Controller('/proteins')
export class DeleteProteinController {
  constructor(private deleteProteinUseCase: ProteinDeleteUseCase) {}

  @Delete(':proteinId')
  @Roles('ADMIN')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a protein.' })
  @ApiParam({
    name: 'proteinId',
    description: 'The unique identifier of the protein',
    example: 'ec82a6b8-ea86-4543-a286-809672bcc423',
  })
  @ApiResponse({
    status: 204,
    description: 'The protein has been deleted successfully.',
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
    description: 'Forbidden. Only admin users can delete a protein.',
  })
  @ApiResponse({
    status: 404,
    description: 'Protein not found.',
  })
  async handle(@Param('proteinId') proteinId: string) {
    const result = await this.deleteProteinUseCase.execute({
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
  }
}

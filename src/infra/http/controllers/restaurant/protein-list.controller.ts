import { BadRequestException, Controller, Get } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ProteinListUseCase } from '@/domain/restaurant/application/use-cases/protein-list.usecase'
import { ProteinPresenter } from '@/infra/http/presenters/restaurant/protein-presenter'

@ApiTags('Catalog (Public)')
@ApiBearerAuth()
@Controller('/proteins')
export class ProteinListController {
  constructor(private listProtein: ProteinListUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List Protein.' })
  @ApiResponse({
    status: 200,
    description: 'A list of proteins.',
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing Bearer token.',
  })
  async handle() {
    const result = await this.listProtein.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const proteins = result.value.proteins

    return {
      proteins: proteins.map(ProteinPresenter.toHTTP),
    }
  }
}

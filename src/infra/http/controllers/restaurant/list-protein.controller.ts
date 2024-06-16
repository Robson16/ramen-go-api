import { ListProteinUseCase } from '@/domain/restaurant/application/use-cases/protein-list.usecase';
import { ProteinPresenter } from '@/infra/http/presenters/protein-presenter';
import { BadRequestException, Controller, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('proteins')
@ApiSecurity('api-key')
@Controller('/proteins')
export class ListProteinController {
  constructor(private listProtein: ListProteinUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List a Protein.' })
  @ApiResponse({
    status: 200,
    description: 'A list of proteins.',
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid API Key.' })
  async handle() {
    const result = await this.listProtein.execute();

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const proteins = result.value.proteins;

    return {
      proteins: proteins.map(ProteinPresenter.toHTTP),
    };
  }
}

import { ListBrothUseCase } from '@/domain/restaurant/application/use-cases/broth-list.usecase';
import { BrothPresenter } from '@/infra/http/presenters/broth-presenter';
import { BadRequestException, Controller, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('broths')
@ApiSecurity('api-key')
@Controller('/broths')
export class ListBrothController {
  constructor(private listBroth: ListBrothUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List a Broth.' })
  @ApiResponse({
    status: 200,
    description: 'A list of broths.',
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Invalid API Key.' })
  async handle() {
    const result = await this.listBroth.execute();

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const broths = result.value.broths;

    return {
      broths: broths.map(BrothPresenter.toHTTP),
    };
  }
}

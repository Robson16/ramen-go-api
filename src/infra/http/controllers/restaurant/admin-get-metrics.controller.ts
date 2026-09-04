import { BadRequestException, Controller, Get } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { AdminGetMetricsUseCase } from '@/domain/restaurant/application/use-cases/admin-get-metrics.usecase'
import { Roles } from '@/infra/auth/roles-decorator'

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('/admin/metrics')
export class AdminGetMetricsController {
  constructor(private adminGetMetrics: AdminGetMetricsUseCase) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Restaurant metrics' })
  @ApiResponse({
    status: 200,
    description: 'Total of broths, proteins and orders.',
    schema: {
      example: {
        totalBroths: 12,
        totalProteins: 8,
        totalOrders: 145,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing Bearer token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admin users can list all orders.',
  })
  async handle() {
    const result = await this.adminGetMetrics.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { totalBroths, totalProteins, totalOrders } = result.value

    return {
      totalBroths,
      totalProteins,
      totalOrders,
    }
  }
}

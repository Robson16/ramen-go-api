import { BadRequestException, Controller, Get } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { UserListUseCase } from '@/domain/account/application/use-cases/user-list.usecase'
import { Roles } from '@/infra/auth/roles-decorator'
import { UserPresenter } from '@/infra/http/presenters/account/user-presenter'

@ApiTags('admin', 'accounts')
@ApiBearerAuth()
@Controller('/admin/users')
export class ListUsersController {
  constructor(private listUser: UserListUseCase) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List Users' })
  @ApiResponse({
    status: 200,
    description: 'A list of users.',
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing Bearer token.',
  })
  async handle() {
    const result = await this.listUser.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const users = result.value.users

    return {
      users: users.map(UserPresenter.toHTTP),
    }
  }
}

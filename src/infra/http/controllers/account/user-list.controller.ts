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

@ApiTags('Accounts (Admin)')
@ApiBearerAuth()
@Controller('/admin/users')
export class UserListController {
  constructor(private listUser: UserListUseCase) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List Users' })
  @ApiResponse({
    status: 200,
    description: 'A list of users.',
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string', example: 'John Doe' },
              email: { type: 'string', example: 'john.doe@example.com' },
              role: {
                type: 'string',
                enum: ['USER', 'ADMIN'],
                example: 'USER',
              },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
              },
            },
          },
        },
      },
      example: {
        users: [
          {
            id: '16b8aee3-90c8-4f42-83cd-7b01e6db30a0',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'USER',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: '2024-01-01T12:00:00.000Z',
          },
        ],
      },
    },
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

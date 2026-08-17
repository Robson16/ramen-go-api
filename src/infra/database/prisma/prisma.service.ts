import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static activePool: Pool | null = null

  constructor(envService: EnvService) {
    const connectionString = envService.get('DATABASE_URL')

    const url = new URL(connectionString)
    const schema = url.searchParams.get('schema') || 'public'

    if (!PrismaService.activePool) {
      PrismaService.activePool = new Pool({
        connectionString,
        options: `-c search_path="${schema}",public`,
      })
    }

    const adapter = new PrismaPg(PrismaService.activePool)

    super({
      adapter,
      log: ['warn', 'error'],
    } as any)
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}

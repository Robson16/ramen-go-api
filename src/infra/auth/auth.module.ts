import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EnvModule } from '../env/env.module';
import { ApiKeyGuard } from './api-key.guard';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AuthModule {}

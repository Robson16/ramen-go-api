import { Module } from '@nestjs/common'

import { MailProvider } from '@/domain/account/application/mailing/mail-provider'
import { EnvModule } from '@/infra/env/env.module'

import { ConsoleMailProvider } from './console-mail-provider'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: MailProvider,
      useClass: ConsoleMailProvider,
    },
  ],
  exports: [MailProvider],
})
export class MailModule {}

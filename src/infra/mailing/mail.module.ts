import { Module } from '@nestjs/common'

import { MailProvider } from '@/domain/account/application/mailing/mail-provider'
import { EnvModule } from '@/infra/env/env.module'

import { NodemailerMailProvider } from './nodemailer-mail-provider'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: MailProvider,
      useClass: NodemailerMailProvider,
    },
  ],
  exports: [MailProvider],
})
export class MailModule {}

import { Injectable, Logger } from '@nestjs/common'

import {
  MailProvider,
  SendMailParams,
} from '@/domain/account/application/mailing/mail-provider'
import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class ConsoleMailProvider implements MailProvider {
  private logger = new Logger(ConsoleMailProvider.name)

  constructor(private env: EnvService) {}

  async send({
    to,
    subject,
    template,
    variables,
  }: SendMailParams): Promise<void> {
    this.logger.log('================= EMAIL MOCK =================')
    this.logger.log(`To: ${to}`)
    this.logger.log(`Subject: ${subject}`)
    this.logger.log(`Template: ${template}`)

    if (template === 'password-reset') {
      const resetUrl = `${this.env.get('APP_URL')}/reset-password?token=${variables.token}`
      this.logger.log(`Hello ${variables.name},`)
      this.logger.log(`[Link de Recuperação]: ${resetUrl}`)
    }

    this.logger.log('==============================================')
  }
}

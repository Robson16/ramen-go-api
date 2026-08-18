import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import { Injectable } from '@nestjs/common'
import * as handlebars from 'handlebars'
import * as nodemailer from 'nodemailer'

import {
  MailProvider,
  SendMailParams,
} from '@/domain/account/application/mailing/mail-provider'
import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class NodemailerMailProvider implements MailProvider {
  private transporter: nodemailer.Transporter

  constructor(private envService: EnvService) {
    this.transporter = nodemailer.createTransport({
      host: this.envService.get('SMTP_HOST'),
      port: Number(this.envService.get('SMTP_PORT')),
      secure: Number(this.envService.get('SMTP_PORT')) === 465,
      auth: {
        user: this.envService.get('SMTP_USER'),
        pass: this.envService.get('SMTP_PASS'),
      },
    })
  }

  async send({
    to,
    subject,
    template,
    variables,
  }: SendMailParams): Promise<void> {
    const templatePath = path.resolve(__dirname, 'views', `${template}.hbs`)

    const templateFileContent = await fs.readFile(templatePath, 'utf-8')

    const parseTemplate = handlebars.compile(templateFileContent)

    const customVariables = { ...variables, link: '' }

    if (template === 'password-reset') {
      customVariables.link = `${this.envService.get('APP_URL')}/reset-password?token=${variables.token}`
    }

    const htmlContent = parseTemplate(customVariables)

    await this.transporter.sendMail({
      from: this.envService.get('MAIL_FROM'),
      to,
      subject,
      html: htmlContent,
    })
  }
}

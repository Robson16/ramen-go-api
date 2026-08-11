import {
  MailProvider,
  SendMailParams,
} from '@/domain/account/application/mailing/mail-provider'

export class FakeMailProvider implements MailProvider {
  public items: SendMailParams[] = []

  async send(params: SendMailParams): Promise<void> {
    this.items.push(params)
  }
}

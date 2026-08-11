export interface SendMailParams {
  to: string
  subject: string
  template: 'password-reset' | 'welcome'
  variables: Record<string, unknown>
}

export abstract class MailProvider {
  abstract send(params: SendMailParams): Promise<void>
}

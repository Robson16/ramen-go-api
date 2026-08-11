import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidTokenError extends Error implements UseCaseError {
  constructor(message: string) {
    super(message)

    this.name = 'InvalidTokenError'
  }
}

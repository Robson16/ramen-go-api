import { UseCaseError } from './use-case-error'

export class ForbiddenError extends Error implements UseCaseError {
  constructor(message: string) {
    super(message)
  }
}

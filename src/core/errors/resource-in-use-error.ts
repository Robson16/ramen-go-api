import { UseCaseError } from '@/core/errors/use-case-error'

export class ResourceInUseError extends Error implements UseCaseError {
  constructor() {
    super(
      'This resource cannot be deleted because it is being used by another record.',
    )
  }
}

import { UseCaseError } from '@/core/errors/use-case-error';

export class InvalidImageTypeError extends Error implements UseCaseError {
  constructor(type: string) {
    super(`Image "${type}" type is not valid.`);
  }
}

import { UseCaseError } from '@/core/errors/use-case-error';

export class BrothAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Broth "${identifier}" already exists.`);
  }
}

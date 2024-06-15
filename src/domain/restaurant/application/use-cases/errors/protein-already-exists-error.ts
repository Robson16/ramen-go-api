import { UseCaseError } from '@/core/errors/use-case-error';

export class ProteinAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Protein "${identifier}" already exists.`);
  }
}

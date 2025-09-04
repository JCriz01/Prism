import { ZodError } from 'zod';
import { AppError, unprocessable } from './app-error';
import { ErrorCode } from './error-codes';

export function mapZodError(err: unknown): AppError | null {
  if (err instanceof ZodError) {
    return unprocessable('Validation failed', {
      code: ErrorCode.VALIDATION_FAILED,
      issues: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    });
  }
  return null;
}

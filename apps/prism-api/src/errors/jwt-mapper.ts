// src/errors/jwt-mapper.ts
import { AppError } from './app-error';
import { ErrorCode } from './error-codes';

// Don't import from jsonwebtoken types to avoid optional peer dep in this mapper.
// Instead, duck-type by name to keep loose coupling.
export function mapJwtError(err: unknown): AppError | null {
  const e = err as Error;
  if (!e || !e.name) return null;

  if (e.name === 'TokenExpiredError') {
    return new AppError('Token expired', {
      status: 401,
      code: ErrorCode.TOKEN_EXPIRED,
    });
  }
  if (e.name === 'JsonWebTokenError' || e.name === 'NotBeforeError') {
    return new AppError('Invalid token', {
      status: 401,
      code: ErrorCode.TOKEN_INVALID,
    });
  }
  return null;
}

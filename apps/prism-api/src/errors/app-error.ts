import { ErrorCode } from './error-codes';

export type SafeDetail = Record<string, unknown>;

export class AppError extends Error {
  public readonly status: number;
  public readonly code: ErrorCode;
  public readonly details?: SafeDetail;
  public readonly cause?: Error;

  constructor(
    message: string,
    options: {
      status?: number;
      code?: ErrorCode;
      details?: SafeDetail;
      cause?: Error;
    } = {},
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'AppError';
    this.status = options.status ?? 500;
    this.code = options.code ?? ErrorCode.INTERNAL;
    this.details = options.details;
    this.cause = options.cause;

    if (Error.captureStackTrace) Error.captureStackTrace(this, AppError);
  }

  static wrap(err: unknown, fallback?: Partial<AppError>) {
    if (err instanceof AppError) return err;
    const e = err as Error;
    return new AppError(e?.message || 'Unexpected Error', {
      status: fallback?.status ?? 500,
      code: fallback?.code ?? ErrorCode.INTERNAL,
      details: fallback?.details,
      cause: e,
    });
  }
}

// Convenience factories
export const badRequest = (msg: string, details?: SafeDetail) =>
  new AppError(msg, { status: 400, code: ErrorCode.BAD_REQUEST, details });

export const unauthorized = (msg = 'Unauthorized', details?: SafeDetail) =>
  new AppError(msg, { status: 401, code: ErrorCode.UNAUTHORIZED, details });

export const forbidden = (msg = 'Forbidden', details?: SafeDetail) =>
  new AppError(msg, { status: 403, code: ErrorCode.FORBIDDEN, details });

export const notFound = (msg = 'Not Found', details?: SafeDetail) =>
  new AppError(msg, { status: 404, code: ErrorCode.NOT_FOUND, details });

export const conflict = (msg: string, details?: SafeDetail) =>
  new AppError(msg, { status: 409, code: ErrorCode.CONFLICT, details });

export const unprocessable = (msg: string, details?: SafeDetail) =>
  new AppError(msg, { status: 422, code: ErrorCode.UNPROCESSABLE, details });

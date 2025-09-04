import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/app-error';
import { mapPrismaError } from '../errors/prisma-mapper';
import { mapZodError } from '../errors/zod-mapper';
import { mapJwtError } from '../errors/jwt-mapper';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const env = process.env.NODE_ENV ?? 'development';
  const requestId = (req as any).requestId as string | undefined;

  const mapped = mapZodError(err) || mapPrismaError(err) || mapJwtError(err);

  const appErr = AppError.wrap(mapped ?? err);

  const body: Record<string, unknown> = {
    type: 'about:blank',
    title: statusTitle(appErr.status),
    code: appErr.code,
    detail: appErr.message,
    requestId,
  };

  // Only include additional details in non-production
  if (env !== 'production') {
    body.details = appErr.details;
    body.stack = appErr.stack?.split('\n').map((s) => s.trim());
    if (appErr.cause) {
      body.cause = {
        name: appErr.cause.name,
        message: appErr.cause.message,
        stack: appErr.cause.stack?.split('\n').map((s) => s.trim()),
      };
    }
  }

  res.status(appErr.status).type('application/problem+json').json(body);
};

function statusTitle(status: number): string {
  switch (status) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    case 409:
      return 'Conflict';
    case 413:
      return 'Payload Too Large';
    case 415:
      return 'Unsupported Media Type';
    case 422:
      return 'Unprocessable Content';
    case 429:
      return 'Too Many Requests';
    case 500:
      return 'Internal Server Error';
    case 503:
      return 'Service Unavailable';
    default:
      return 'Error';
  }
}

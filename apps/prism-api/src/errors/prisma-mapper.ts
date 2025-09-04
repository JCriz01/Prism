import { Prisma } from '@prisma/client';
import {
  AppError,
  SafeDetail,
  badRequest,
  conflict,
  notFound,
} from './app-error';
import { ErrorCode } from './error-codes';

export function mapPrismaError(err: unknown): AppError | null {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        return conflict('Unique constraint failed', {
          target: (err.meta?.target as string[])?.join(', '),
          prismaCode: err.code,
        });

      case 'P2003': // Foreign key constraint
        return new AppError('Foreign key constraint failed', {
          status: 409,
          code: ErrorCode.PRISMA_FOREIGN_KEY_CONSTRAINT,
          details: { field: err.meta?.field_name, prismaCode: err.code },
        });
      case 'P2025': // Record not found
        return notFound('Resource not found', {
          prismaCode: err.code,
          cause: err.meta?.cause,
        });
      case 'P2001': // Record does not exist
        return notFound('Record does not exist', { prismaCode: err.code });
      case 'P2005': // Invalid field value
      case 'P2009':
        return badRequest('Invalid field value', {
          prismaCode: err.code,
          field: err.meta?.field_name,
        });

      default:
        return new AppError('Database error', {
          status: 500,
          code: ErrorCode.INTERNAL,
          details: { prismaCode: err.code },
        });
    }
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    return badRequest('Invalid Prisma client input');
  }
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return new AppError('Unknown database error', { status: 500 });
  }
  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return new AppError('Database engine panic', { status: 503 });
  }
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return new AppError('Database initialization error', { status: 503 });
  }

  return null;
}

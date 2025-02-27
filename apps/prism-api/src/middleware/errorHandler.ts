import { Request, Response, NextFunction } from 'express';

interface ErrorStatus extends Error {
  status?: number;
}

//Handing Not Found Errors
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const error: ErrorStatus = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

//Main Error Handler
export const errorHandler = (
  error: ErrorStatus,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = error.status || 500;

  //Logging errors
  console.error(`Error Occurred: ${error} | Status Code: ${statusCode}`);

  //* Replace stack with error.stack in the object below to display the stack trace in the response
  //* ...(req.app.get('env') === 'development' && { stack: error.stack }),

  res.status(statusCode).json({
    error: {
      message: error.message,
      stack: error.stack,
    },
  });
};

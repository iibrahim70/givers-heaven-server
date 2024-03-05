/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = 500;
  const defaultMessage = 'Something went wrong';

  let errorMessage = defaultMessage;
  if (error && error?.errors && Array.isArray(error?.errors)) {
    errorMessage = error?.errors.map((err: any) => err.message);
  }

  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: error?.errors,
  });
};

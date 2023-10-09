import { Prisma } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'express-oauth2-jwt-bearer';
import { ZodError } from 'zod';

import ApiError from '../../model/ApiError';

const isPrismaError = (err: Error) => {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientRustPanicError ||
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientValidationError
  );
};

const prismaErrorToHttpError = (err: Error, res: Response) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(400).json({
        message: `A record with the same ${err?.meta?.target} already exists.`,
      });
    } else if (err.code === 'P2025') {
      return res
        .status(404)
        .json({ message: err?.meta?.cause || 'Record not found!' });
    } else {
      // TODO: Go through https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
      // and decide which are input errors (400) and which are not (500)
      return res.status(500).json({ message: 'Internal server error!' });
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: 'Bad request! A validation error occurred!',
    });
  } else {
    return res.status(500).json({ message: 'Internal server error!' });
  }
};

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err) {
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: err.message });
    } else if (err instanceof ZodError) {
      return res
        .status(400)
        .json({ message: err.issues[0]?.message || 'Bad request!' });
    } else if (
      (err.name && err.name === 'NotFoundError') ||
      (err.name && err.name === 'RecordNotFound')
    ) {
      // Prisma throws NotFoundError when findUnique fails to find the resource!
      // It throws RecordNotFound when delete or update operations fail to find the record.
      return res.status(404).json({ message: err.message });
    } else if (isPrismaError(err)) {
      // Check for other Prisma Errors
      prismaErrorToHttpError(err, res);
    } else if (err instanceof ApiError) {
      return res
        .status(err.status || 500)
        .json({ message: err.message || 'Internal server error!' });
    } else {
      return res.status(500).json({ message: 'Internal server error!' });
    }
  }
  next();
};

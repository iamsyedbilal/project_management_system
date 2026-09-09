import type { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => unknown | Promise<unknown>;

const asyncHandler = (handler: AsyncRequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

export default asyncHandler;

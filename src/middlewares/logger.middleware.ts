import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

type Next = () => Promise<NextFunction>;

export const loggerMiddleware = async (
  req: Request,
  res: Response,
  next: Next,
) => {
  const message = `${req.method} ${req.url}`;
  Logger.debug(`Start: ${message}`);

  await next();

  res.on('finish', () => Logger.debug(`End: ${message}`));
};

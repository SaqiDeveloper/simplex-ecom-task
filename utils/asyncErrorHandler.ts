import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export default (func: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    func(req, res, next).catch((err: Error) => next(err));
  };
};


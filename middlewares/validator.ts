import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { STATUS_CODES } from '../config/constants';

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMsg = error.details[0].message;
      const err = errorMsg.replace(/"/g, "");
      res.status(STATUS_CODES.BAD_REQUEST).json({ 
        statusCode: STATUS_CODES.BAD_REQUEST, 
        message: err 
      });
      return;
    }
    next();
  };
};

export const validateParams = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.params);
    if (error) {
      const errorMsg = error.details[0].message;
      const err = errorMsg.replace(/"/g, "");
      res.status(STATUS_CODES.BAD_REQUEST).json({ 
        statusCode: STATUS_CODES.BAD_REQUEST, 
        message: err 
      });
      return;
    }
    next();
  };
};


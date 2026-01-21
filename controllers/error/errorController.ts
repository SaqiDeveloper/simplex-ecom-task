import { Response, NextFunction } from 'express';
import { CustomError } from '../../utils/CustomError';
import { Request } from 'express';

const devErrors = (res: Response, error: any): void => {
  console.log("Error : =>", error);
  if (error.message === "Validation error") {
    const errorMessage = error?.errors?.[0];
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: errorMessage?.message || error.message,
      stackTrace: error.stack,
      error: error,
    });
  } else {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      stackTrace: error.stack,
      error: error,
    });
  }
};

const castErrorHandler = (err: any): CustomError => {
  const msg = `Invalid value for ${err.path}: ${err.value}!`;
  return new CustomError(msg, 400);
};

const duplicateKeyErrorHandler = (err: any): CustomError => {
  const name = err.keyValue?.name;
  const msg = `There is already a record with name ${name}. Please use another name!`;
  return new CustomError(msg, 400);
};

const validationErrorHandler = (err: any): CustomError => {
  const errors = Object.values(err.errors || {}).map((val: any) => val.message);
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data: ${errorMessages}`;
  return new CustomError(msg, 400);
};

const constraintError = (_err: any): CustomError => {
  const msg = "Database constraint error occurred.";
  return new CustomError(msg, 400);
};

const connectionRefusedError = (_err: any): CustomError => {
  const msg = "Database connection failed, Please check your internet";
  return new CustomError(msg, 400);
};

const actualMessageId = (_err: any): CustomError => {
  const msg = "Please pass the valid message Id instead of messageId in params";
  return new CustomError(msg, 400);
};

const actualFamilyId = (_err: any): CustomError => {
  const msg = "Please pass the valid family Id instead of familyId in params";
  return new CustomError(msg, 400);
};

const actualId = (_err: any): CustomError => {
  const msg = `Please pass the valid Id instead of Id in params`;
  return new CustomError(msg, 400);
};

const actualUserId = (_err: any): CustomError => {
  const msg = "Please pass the valid user Id instead of userId in params";
  return new CustomError(msg, 400);
};

const invalidUUID = (_err: any): CustomError => {
  const msg = "Please pass the valid UUID";
  return new CustomError(msg, 400);
};

const prodErrors = (res: Response, error: CustomError): void => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

const globalErrorHandler = (error: any, _req: Request, res: Response, _next: NextFunction): void => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    if (error.message === `insert or update on table "familyChats" violates foreign key constraint "familyChats_familyId_fkey"`) error = constraintError(error);
    if (error.message === `read ECONNRESET`) error = connectionRefusedError(error);
    if (error.message === `invalid input syntax for type uuid: "messageId"`) error = actualMessageId(error);
    if (error.message === `invalid input syntax for type uuid: "familyId"`) error = actualFamilyId(error);
    if (error.message === `invalid input syntax for type uuid: "id"`) error = actualId(error);
    if (error.message === `invalid input syntax for type uuid: "userId"`) error = actualUserId(error);
    if (error.message?.split(':')[0] === "invalid input syntax for type uuid") error = invalidUUID(error);

    prodErrors(res, error);
  }
};

export default globalErrorHandler;


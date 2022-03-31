import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const { analysts = {} } = err.meta || {};

  // // logging for analysts
  // console.log({ analysts });

  // if (err) {
  //   const newError = new Error(err);
  // }

  next(err);
};

export const returnError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode || 500).send(err);
};

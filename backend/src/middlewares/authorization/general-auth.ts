import { NextFunction, Request, Response } from "express";

export const authenticationCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};

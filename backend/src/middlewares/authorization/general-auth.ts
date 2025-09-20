import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";

export const authenticationCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);
  console.log(auth);
  if (auth.isAuthenticated) {
    next();
  }
};

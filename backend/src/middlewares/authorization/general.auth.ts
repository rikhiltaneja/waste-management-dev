import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";

interface AuthRequest extends Request{
  auth?: any
}

export const authenticationCheck = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);
  if (auth.isAuthenticated) {
    req.auth = auth
    next()
  }
};
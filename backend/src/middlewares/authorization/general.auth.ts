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
  } else {
    return res.status(401).json({
      error: {
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      }
    });
  }
};
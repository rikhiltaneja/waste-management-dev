import { Request, Response, NextFunction } from 'express';


export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    sessionId: string;
  };
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  req.auth = {
    userId: 'mock-user-id',
    sessionId: 'mock-session-id'
  };
  next();
};

export const requireRole = (allowedRoles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.auth?.userId) {
      return res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'UNAUTHORIZED'
        }
      });
    }

    next();
  };
};

export const requireAdminRole = requireRole(['ADMIN', 'DISTRICT_ADMIN', 'LOCALITY_ADMIN']);
export const requireDistrictAdmin = requireRole(['DISTRICT_ADMIN']);
export const requireLocalityAdmin = requireRole(['LOCALITY_ADMIN']);
export const requireWebsiteAdmin = requireRole(['ADMIN']);
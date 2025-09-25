import { NextFunction, Response } from "express";

interface AuthRequest extends Express.Request {
  auth?: any; // ideally type this properly later
}

export const onlyAdmins = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const metadata: { role: string } = req.auth?.sessionClaims?.metadata as {
    role: string;
  };

  if (metadata?.role === "Admin") {
    return next();
  }

  return res.status(401).json({ error: "Not Authorised" });
};

export const allAdmins = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const metadata: { role: string } = req.auth?.sessionClaims?.metadata as {
    role: string;
  };

  if (
    metadata?.role === "Admin" ||
    metadata?.role === "DistrictAdmin" ||
    metadata?.role === "LocalityAdmin"
  ) {
    return next();
  }

  return res.status(401).json({ error: "Not Authorised" });
};

export const adminsAndWorkers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const metadata: { role: string } = req.auth?.sessionClaims?.metadata as {
    role: string;
  };

  if (
    metadata?.role === "Admin" ||
    metadata?.role === "DistrictAdmin" ||
    metadata?.role === "LocalityAdmin" ||
    metadata?.role === "Worker"
  ) {
    return next();
  }

  return res.status(401).json({ error: "Not Authorised" });
};

export const adminsAndCitizens = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const metadata: { role: string } = req.auth?.sessionClaims?.metadata as {
    role: string;
  };

  if (
    metadata?.role === "Admin" ||
    metadata?.role === "DistrictAdmin" ||
    metadata?.role === "LocalityAdmin" ||
    metadata?.role === "Citizen"
  ) {
    return next();
  }

  return res.status(401).json({ error: "Not Authorised" });
};

export const allUserTypes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const metadata: { role: string } = req.auth?.sessionClaims?.metadata as {
    role: string;
  };

  if (
    metadata?.role === "Admin" ||
    metadata?.role === "DistrictAdmin" ||
    metadata?.role === "LocalityAdmin" ||
    metadata?.role === "Citizen" ||
    metadata?.role === "Worker"
  ) {
    return next();
  }

  return res.status(401).json({ error: "Not Authorised" });
};

export const onlyCitizens = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const metadata: { role: string } = req.auth?.sessionClaims?.metadata as {
    role: string;
  };

  if (metadata?.role === "Citizen") {
    return next();
  }

  return res.status(401).json({ error: "Not Authorised" });
};
import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";

export const onlyAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);
  const metadata: { role: string } = auth.sessionClaims?.metadata as {
    role: string;
  };
  if (metadata.role == "Admin") {
    next();
  }
  res.status(401).json({ error: "Not Authorised" });
};

export const allAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);
  const metadata: { role: string } = auth.sessionClaims?.metadata as {
    role: string;
  };
  if (
    metadata.role == "Admin" ||
    metadata.role == "DistrictAdmin" ||
    metadata.role == "LocalityAdmin"
  ) {
    next();
  }
  res.status(401).json({ error: "Not Authorised" });
};

export const adminsAndWorkers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);
  const metadata: { role: string } = auth.sessionClaims?.metadata as {
    role: string;
  };
  if (
    metadata.role == "Admin" ||
    metadata.role == "DistrictAdmin" ||
    metadata.role == "LocalityAdmin" ||
    metadata.role == "Worker"
  ) {
    next();
  }
  res.status(401).json({ error: "Not Authorised" });
};

export const adminsAndCitizens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);
  const metadata: { role: string } = auth.sessionClaims?.metadata as {
    role: string;
  };
  if (
    metadata.role == "Admin" ||
    metadata.role == "DistrictAdmin" ||
    metadata.role == "LocalityAdmin" ||
    metadata.role == "Citizen"
  ) {
    next();
  }
  res.status(401).json({ error: "Not Authorised" });
};

export const allUserTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);
  const metadata: { role: string } = auth.sessionClaims?.metadata as {
    role: string;
  };
  if (
    metadata.role == "Admin" ||
    metadata.role == "DistrictAdmin" ||
    metadata.role == "LocalityAdmin" ||
    metadata.role == "Citizen" ||
    metadata.role == "Worker"
  ) {
    next();
  }
  res.status(401).json({ error: "Not Authorised" });
};

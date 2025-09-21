import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "../../prisma/generated/prisma";
import { AuthenticatedRequest } from './auth.middleware';

const prisma = new PrismaClient();

export const validateEventCreator = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { eventId } = req.params;
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'UNAUTHORIZED'
        }
      });
    }

    const event = await prisma.physicalTrainingEvent.findUnique({
      where: { id: parseInt(eventId) },
      select: {
        createdByDistrictAdminId: true,
        createdByLocalityAdminId: true
      }
    });

    if (!event) {
      return res.status(404).json({
        error: {
          message: 'Event not found',
          code: 'EVENT_NOT_FOUND'
        }
      });
    }

    const isCreator = event.createdByDistrictAdminId === userId || event.createdByLocalityAdminId === userId;

    if (!isCreator) {
      return res.status(403).json({
        error: {
          message: 'Access denied. Only event creators can perform this action.',
          code: 'ACCESS_DENIED'
        }
      });
    }

    next();
  } catch (error) {
    console.error('Error validating event creator:', error);
    res.status(500).json({
      error: {
        message: 'Failed to validate permissions',
        code: 'VALIDATION_ERROR'
      }
    });
  }
};

export const validateLocalityAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { localityId } = req.params;
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'UNAUTHORIZED'
        }
      });
    }

    const localityAdmin = await prisma.localityAdmin.findFirst({
      where: {
        id: userId,
        locality: {
          id: parseInt(localityId)
        }
      }
    });

    const districtAdmin = await prisma.districtAdmin.findFirst({
      where: {
        id: userId,
        district: {
          localities: {
            some: {
              id: parseInt(localityId)
            }
          }
        }
      }
    });

    if (!localityAdmin && !districtAdmin) {
      return res.status(403).json({
        error: {
          message: 'Access denied. Insufficient permissions for this locality.',
          code: 'ACCESS_DENIED'
        }
      });
    }

    next();
  } catch (error) {
    console.error('Error validating locality access:', error);
    res.status(500).json({
      error: {
        message: 'Failed to validate locality access',
        code: 'VALIDATION_ERROR'
      }
    });
  }
};

export const validateDistrictAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { districtId } = req.params;
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        error: {
          message: 'Authentication required',
          code: 'UNAUTHORIZED'
        }
      });
    }

    const districtAdmin = await prisma.districtAdmin.findFirst({
      where: {
        id: userId,
        district: {
          id: parseInt(districtId)
        }
      }
    });

    if (!districtAdmin) {
      return res.status(403).json({
        error: {
          message: 'Access denied. Insufficient permissions for this district.',
          code: 'ACCESS_DENIED'
        }
      });
    }

    next();
  } catch (error) {
    console.error('Error validating district access:', error);
    res.status(500).json({
      error: {
        message: 'Failed to validate district access',
        code: 'VALIDATION_ERROR'
      }
    });
  }
};
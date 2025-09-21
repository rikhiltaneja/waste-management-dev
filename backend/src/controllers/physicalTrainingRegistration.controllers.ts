import { Request, Response } from 'express';
import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();


export const registerForEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { userType, userId } = req.body;

    // Validate input
    if (!userType || !userId) {
      return res.status(400).json({
        error: {
          message: 'userType and userId are required',
          code: 'MISSING_REQUIRED_FIELDS'
        }
      });
    }

    if (!['CITIZEN', 'WORKER'].includes(userType)) {
      return res.status(400).json({
        error: {
          message: 'userType must be either CITIZEN or WORKER',
          code: 'INVALID_USER_TYPE'
        }
      });
    }

    // Check if event exists and is active
    const event = await prisma.physicalTrainingEvent.findUnique({
      where: { id: parseInt(eventId) },
      include: {
        _count: {
          select: {
            registrations: {
              where: {
                status: 'REGISTERED'
              }
            }
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({
        error: {
          message: 'Physical training event not found',
          code: 'EVENT_NOT_FOUND'
        }
      });
    }

    if (event.status !== 'ACTIVE') {
      return res.status(400).json({
        error: {
          message: 'Cannot register for inactive event',
          code: 'EVENT_NOT_ACTIVE'
        }
      });
    }

    // Check capacity
    if (event.maxCapacity && event._count.registrations >= event.maxCapacity) {
      return res.status(409).json({
        error: {
          message: 'Event has reached maximum capacity',
          code: 'CAPACITY_FULL'
        }
      });
    }

    // Verify user exists and get their locality
    let user;
    if (userType === 'CITIZEN') {
      user = await prisma.citizen.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, localityId: true }
      });
    } else {
      user = await prisma.worker.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, localityId: true }
      });
    }

    if (!user) {
      return res.status(404).json({
        error: {
          message: `${userType.toLowerCase()} not found`,
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Check if user is eligible for this event (target audience)
    const userRole = userType as 'CITIZEN' | 'WORKER';
    if (!event.targetAudience.includes(userRole)) {
      return res.status(400).json({
        error: {
          message: `This event is not available for ${userType.toLowerCase()}s`,
          code: 'NOT_ELIGIBLE'
        }
      });
    }

    // Check if already registered
    const existingRegistration = await prisma.physicalTrainingRegistration.findFirst({
      where: {
        physicalTrainingEventId: parseInt(eventId),
        ...(userType === 'CITIZEN' ? { citizenId: userId } : { workerId: userId })
      }
    });

    if (existingRegistration) {
      return res.status(409).json({
        error: {
          message: 'User is already registered for this event',
          code: 'ALREADY_REGISTERED'
        }
      });
    }

    // Check for time conflicts with other registered events
    const conflictingEvents = await prisma.physicalTrainingRegistration.findMany({
      where: {
        ...(userType === 'CITIZEN' ? { citizenId: userId } : { workerId: userId }),
        status: 'REGISTERED',
        physicalTrainingEvent: {
          status: 'ACTIVE',
          OR: [
            {
              // Event starts during this event
              startDateTime: {
                gte: event.startDateTime,
                lt: event.endDateTime || event.startDateTime
              }
            },
            {
              // Event ends during this event
              endDateTime: {
                gt: event.startDateTime,
                lte: event.endDateTime || event.startDateTime
              }
            },
            {
              // Event completely overlaps this event
              AND: [
                { startDateTime: { lte: event.startDateTime } },
                {
                  OR: [
                    { endDateTime: { gte: event.endDateTime || event.startDateTime } },
                    { endDateTime: null }
                  ]
                }
              ]
            }
          ]
        }
      },
      include: {
        physicalTrainingEvent: {
          select: {
            id: true,
            title: true,
            startDateTime: true,
            endDateTime: true
          }
        }
      }
    });

    if (conflictingEvents.length > 0) {
      return res.status(409).json({
        error: {
          message: 'User has conflicting training events at the same time',
          code: 'TIME_CONFLICT',
          details: {
            conflictingEvents: conflictingEvents.map((reg: any) => ({
              eventId: reg.physicalTrainingEvent.id,
              title: reg.physicalTrainingEvent.title,
              startDateTime: reg.physicalTrainingEvent.startDateTime,
              endDateTime: reg.physicalTrainingEvent.endDateTime
            }))
          }
        }
      });
    }

    const registration = await prisma.physicalTrainingRegistration.create({
      data: {
        physicalTrainingEventId: parseInt(eventId),
        ...(userType === 'CITIZEN' ? { citizenId: userId } : { workerId: userId }),
        status: 'REGISTERED'
      },
      include: {
        citizen: userType === 'CITIZEN' ? {
          select: { id: true, name: true, email: true }
        } : undefined,
        worker: userType === 'WORKER' ? {
          select: { id: true, name: true, email: true }
        } : undefined,
        physicalTrainingEvent: {
          select: {
            id: true,
            title: true,
            startDateTime: true,
            endDateTime: true,
            location: true
          }
        }
      }
    });

    // TODO: Send confirmation notification to user

    res.status(201).json({
      message: 'Successfully registered for the training event',
      registration
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({
      error: {
        message: 'Failed to register for training event',
        code: 'REGISTRATION_ERROR'
      }
    });
  }
};


export const cancelRegistration = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { userType, userId } = req.body;

    // Validate input
    if (!userType || !userId) {
      return res.status(400).json({
        error: {
          message: 'userType and userId are required',
          code: 'MISSING_REQUIRED_FIELDS'
        }
      });
    }

    // Find existing registration
    const registration = await prisma.physicalTrainingRegistration.findFirst({
      where: {
        physicalTrainingEventId: parseInt(eventId),
        ...(userType === 'CITIZEN' ? { citizenId: userId } : { workerId: userId }),
        status: 'REGISTERED'
      },
      include: {
        physicalTrainingEvent: {
          select: {
            id: true,
            title: true,
            startDateTime: true,
            status: true
          }
        }
      }
    });

    if (!registration) {
      return res.status(404).json({
        error: {
          message: 'Registration not found or already cancelled',
          code: 'REGISTRATION_NOT_FOUND'
        }
      });
    }

    // Check if event has already started (optional business rule)
    const now = new Date();
    if (registration.physicalTrainingEvent.startDateTime <= now) {
      return res.status(400).json({
        error: {
          message: 'Cannot cancel registration for events that have already started',
          code: 'EVENT_ALREADY_STARTED'
        }
      });
    }

    // Update registration status to cancelled
    const cancelledRegistration = await prisma.physicalTrainingRegistration.update({
      where: { id: registration.id },
      data: { status: 'CANCELLED' },
      include: {
        physicalTrainingEvent: {
          select: {
            id: true,
            title: true,
            startDateTime: true
          }
        }
      }
    });

    // TODO: Send cancellation confirmation notification

    res.json({
      message: 'Registration cancelled successfully',
      registration: cancelledRegistration
    });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    res.status(500).json({
      error: {
        message: 'Failed to cancel registration',
        code: 'CANCELLATION_ERROR'
      }
    });
  }
};


export const getUserRegistrations = async (req: Request, res: Response) => {
  try {
    const { userType, userId } = req.params;
    const { status, upcoming } = req.query;

    // Validate userType
    if (!['citizen', 'worker'].includes(userType)) {
      return res.status(400).json({
        error: {
          message: 'userType must be either citizen or worker',
          code: 'INVALID_USER_TYPE'
        }
      });
    }

    // Build filter conditions
    const where: any = {
      ...(userType === 'citizen' ? { citizenId: userId } : { workerId: userId })
    };

    if (status) {
      where.status = status;
    }

    // Filter for upcoming events
    if (upcoming === 'true') {
      where.physicalTrainingEvent = {
        startDateTime: {
          gte: new Date()
        }
      };
    }

    const registrations = await prisma.physicalTrainingRegistration.findMany({
      where,
      include: {
        physicalTrainingEvent: {
          select: {
            id: true,
            title: true,
            description: true,
            startDateTime: true,
            endDateTime: true,
            location: true,
            status: true,
            maxCapacity: true,
            _count: {
              select: {
                registrations: {
                  where: { status: 'REGISTERED' }
                }
              }
            }
          }
        }
      },
      orderBy: {
        physicalTrainingEvent: {
          startDateTime: 'asc'
        }
      }
    });

    res.json({
      registrations
    });
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch user registrations',
        code: 'FETCH_REGISTRATIONS_ERROR'
      }
    });
  }
};


export const getEventRegistrations = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { status } = req.query;

    // TODO: Add authorization check - only event creators or admins should access this

    // Build filter conditions
    const where: any = {
      physicalTrainingEventId: parseInt(eventId)
    };

    if (status) {
      where.status = status;
    }

    const registrations = await prisma.physicalTrainingRegistration.findMany({
      where,
      include: {
        citizen: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            locality: {
              select: {
                id: true,
                district: {
                  select: {
                    id: true
                  }
                }
              }
            }
          }
        },
        worker: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            locality: {
              select: {
                id: true,
                district: {
                  select: {
                    id: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        registrationDate: 'asc'
      }
    });

    // Get event details
    const event = await prisma.physicalTrainingEvent.findUnique({
      where: { id: parseInt(eventId) },
      select: {
        id: true,
        title: true,
        startDateTime: true,
        maxCapacity: true
      }
    });

    res.json({
      event,
      registrations,
      summary: {
        total: registrations.length,
        registered: registrations.filter((r: any) => r.status === 'REGISTERED').length,
        cancelled: registrations.filter((r: any) => r.status === 'CANCELLED').length,
        waitlisted: registrations.filter((r: any) => r.status === 'WAITLISTED').length
      }
    });
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch event registrations',
        code: 'FETCH_EVENT_REGISTRATIONS_ERROR'
      }
    });
  }
};
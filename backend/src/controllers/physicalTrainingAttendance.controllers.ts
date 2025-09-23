import { Request, Response } from 'express';
import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { userId, userType, status, completionStatus } = req.body;

    if (!userId || !userType || !status) {
      return res.status(400).json({
        error: {
          message: 'userId, userType, and status are required',
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

    if (!['PRESENT', 'ABSENT', 'LATE'].includes(status)) {
      return res.status(400).json({
        error: {
          message: 'status must be PRESENT, ABSENT, or LATE',
          code: 'INVALID_STATUS'
        }
      });
    }

    const event = await prisma.physicalTrainingEvent.findUnique({
      where: { id: parseInt(eventId) }
    });

    if (!event) {
      return res.status(404).json({
        error: {
          message: 'Physical training event not found',
          code: 'EVENT_NOT_FOUND'
        }
      });
    }

    const registration = await prisma.physicalTrainingRegistration.findFirst({
      where: {
        physicalTrainingEventId: parseInt(eventId),
        ...(userType === 'CITIZEN' ? { citizenId: userId } : { workerId: userId }),
        status: 'REGISTERED'
      }
    });

    if (!registration) {
      return res.status(404).json({
        error: {
          message: 'User is not registered for this event',
          code: 'NOT_REGISTERED'
        }
      });
    }

    const existingAttendance = await prisma.physicalTrainingAttendance.findFirst({
      where: {
        physicalTrainingEventId: parseInt(eventId),
        ...(userType === 'CITIZEN' ? { citizenId: userId } : { workerId: userId })
      }
    });

    let attendance;
    if (existingAttendance) {
      attendance = await prisma.physicalTrainingAttendance.update({
        where: { id: existingAttendance.id },
        data: {
          status,
          completionStatus: completionStatus || (status === 'PRESENT' ? 'COMPLETED' : 'NOT_COMPLETED')
        },
        include: {
          citizen: userType === 'CITIZEN' ? {
            select: { id: true, name: true, email: true }
          } : undefined,
          worker: userType === 'WORKER' ? {
            select: { id: true, name: true, email: true }
          } : undefined,
          physicalTrainingEvent: {
            select: { id: true, title: true, startDateTime: true }
          }
        }
      });
    } else {
      attendance = await prisma.physicalTrainingAttendance.create({
        data: {
          physicalTrainingEventId: parseInt(eventId),
          ...(userType === 'CITIZEN' ? { citizenId: userId } : { workerId: userId }),
          status,
          completionStatus: completionStatus || (status === 'PRESENT' ? 'COMPLETED' : 'NOT_COMPLETED')
        },
        include: {
          citizen: userType === 'CITIZEN' ? {
            select: { id: true, name: true, email: true }
          } : undefined,
          worker: userType === 'WORKER' ? {
            select: { id: true, name: true, email: true }
          } : undefined,
          physicalTrainingEvent: {
            select: { id: true, title: true, startDateTime: true }
          }
        }
      });
    }

    res.json({
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({
      error: {
        message: 'Failed to mark attendance',
        code: 'ATTENDANCE_ERROR'
      }
    });
  }
};

export const getEventAttendance = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { status } = req.query;

    const where: any = {
      physicalTrainingEventId: parseInt(eventId)
    };

    if (status) {
      where.status = status;
    }

    const attendances = await prisma.physicalTrainingAttendance.findMany({
      where,
      include: {
        citizen: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true
          }
        },
        worker: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true
          }
        }
      },
      orderBy: {
        attendanceDate: 'desc'
      }
    });

    const event = await prisma.physicalTrainingEvent.findUnique({
      where: { id: parseInt(eventId) },
      select: {
        id: true,
        title: true,
        startDateTime: true,
        _count: {
          select: {
            registrations: {
              where: { status: 'REGISTERED' }
            }
          }
        }
      }
    });

    res.json({
      event,
      attendances,
      summary: {
        total: attendances.length,
        present: attendances.filter((a: any) => a.status === 'PRESENT').length,
        absent: attendances.filter((a: any) => a.status === 'ABSENT').length,
        late: attendances.filter((a: any) => a.status === 'LATE').length,
        completed: attendances.filter((a: any) => a.completionStatus === 'COMPLETED').length
      }
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch attendance records',
        code: 'FETCH_ATTENDANCE_ERROR'
      }
    });
  }
};

export const generateCertificate = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { userId, userType } = req.body;

    const attendance = await prisma.physicalTrainingAttendance.findFirst({
      where: {
        physicalTrainingEventId: parseInt(eventId),
        ...(userType === 'CITIZEN' ? { citizenId: userId } : { workerId: userId }),
        status: 'PRESENT',
        completionStatus: 'COMPLETED'
      },
      include: {
        citizen: userType === 'CITIZEN' ? {
          select: { id: true, name: true, email: true }
        } : undefined,
        worker: userType === 'WORKER' ? {
          select: { id: true, name: true, email: true }
        } : undefined,
        physicalTrainingEvent: {
          select: { id: true, title: true, startDateTime: true }
        }
      }
    });

    if (!attendance) {
      return res.status(404).json({
        error: {
          message: 'No completed attendance record found',
          code: 'NO_COMPLETION_RECORD'
        }
      });
    }

    const certificateUrl = `certificates/${eventId}-${userId}-${Date.now()}.pdf`;

    const updatedAttendance = await prisma.physicalTrainingAttendance.update({
      where: { id: attendance.id },
      data: {
        certificateUrl,
        completionStatus: 'CERTIFIED'
      }
    });

    res.json({
      message: 'Certificate generated successfully',
      certificateUrl,
      attendance: updatedAttendance
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({
      error: {
        message: 'Failed to generate certificate',
        code: 'CERTIFICATE_ERROR'
      }
    });
  }
};
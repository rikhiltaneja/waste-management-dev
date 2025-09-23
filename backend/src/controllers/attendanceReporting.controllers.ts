import { Request, Response } from 'express';
import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();

export const getAttendanceStatistics = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const attendances = await prisma.physicalTrainingAttendance.findMany({
      where: {
        physicalTrainingEventId: parseInt(eventId)
      }
    });

    const registrations = await prisma.physicalTrainingRegistration.count({
      where: {
        physicalTrainingEventId: parseInt(eventId),
        status: 'REGISTERED'
      }
    });

    const stats = {
      totalRegistered: registrations,
      totalAttendanceRecords: attendances.length,
      present: attendances.filter(a => a.status === 'PRESENT').length,
      absent: attendances.filter(a => a.status === 'ABSENT').length,
      late: attendances.filter(a => a.status === 'LATE').length,
      completed: attendances.filter(a => a.completionStatus === 'COMPLETED').length,
      certified: attendances.filter(a => a.completionStatus === 'CERTIFIED').length,
      attendanceRate: registrations > 0 ? (attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length / registrations * 100) : 0,
      completionRate: registrations > 0 ? (attendances.filter(a => a.completionStatus === 'COMPLETED' || a.completionStatus === 'CERTIFIED').length / registrations * 100) : 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch attendance statistics',
        code: 'STATS_ERROR'
      }
    });
  }
};

export const getMissedTrainingUsers = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const registrations = await prisma.physicalTrainingRegistration.findMany({
      where: {
        physicalTrainingEventId: parseInt(eventId),
        status: 'REGISTERED'
      },
      include: {
        citizen: {
          select: { id: true, name: true, email: true, phoneNumber: true }
        },
        worker: {
          select: { id: true, name: true, email: true, phoneNumber: true }
        }
      }
    });

    const attendances = await prisma.physicalTrainingAttendance.findMany({
      where: {
        physicalTrainingEventId: parseInt(eventId)
      }
    });

    const attendedUserIds = new Set([
      ...attendances.filter(a => a.citizenId).map(a => a.citizenId),
      ...attendances.filter(a => a.workerId).map(a => a.workerId)
    ]);

    const missedUsers = registrations.filter(reg => {
      const userId = reg.citizenId || reg.workerId;
      return !attendedUserIds.has(userId);
    });

    const absentUsers = attendances.filter(a => a.status === 'ABSENT');

    res.json({
      missedTraining: missedUsers.map(reg => ({
        userId: reg.citizenId || reg.workerId,
        userType: reg.citizenId ? 'CITIZEN' : 'WORKER',
        user: reg.citizen || reg.worker,
        registrationDate: reg.registrationDate,
        reason: 'NO_ATTENDANCE_RECORD'
      })),
      markedAbsent: absentUsers.map(att => ({
        userId: att.citizenId || att.workerId,
        userType: att.citizenId ? 'CITIZEN' : 'WORKER',
        attendanceDate: att.attendanceDate,
        reason: 'MARKED_ABSENT'
      })),
      summary: {
        totalMissed: missedUsers.length + absentUsers.length,
        noRecord: missedUsers.length,
        markedAbsent: absentUsers.length
      }
    });
  } catch (error) {
    console.error('Error fetching missed training users:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch missed training users',
        code: 'MISSED_USERS_ERROR'
      }
    });
  }
};

export const getLocalityAttendanceReport = async (req: Request, res: Response) => {
  try {
    const { localityId } = req.params;
    const { startDate, endDate } = req.query;

    const where: any = {
      locality: {
        id: parseInt(localityId)
      }
    };

    if (startDate || endDate) {
      where.startDateTime = {};
      if (startDate) where.startDateTime.gte = new Date(startDate as string);
      if (endDate) where.startDateTime.lte = new Date(endDate as string);
    }

    const events = await prisma.physicalTrainingEvent.findMany({
      where,
      include: {
        attendances: true,
        registrations: {
          where: { status: 'REGISTERED' }
        }
      }
    });

    const report = events.map(event => {
      const attendances = event.attendances;
      const registrations = event.registrations;

      return {
        eventId: event.id,
        title: event.title,
        startDateTime: event.startDateTime,
        totalRegistered: registrations.length,
        totalAttended: attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length,
        completed: attendances.filter(a => a.completionStatus === 'COMPLETED' || a.completionStatus === 'CERTIFIED').length,
        attendanceRate: registrations.length > 0 ? (attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length / registrations.length * 100) : 0,
        completionRate: registrations.length > 0 ? (attendances.filter(a => a.completionStatus === 'COMPLETED' || a.completionStatus === 'CERTIFIED').length / registrations.length * 100) : 0
      };
    });

    const summary = {
      totalEvents: events.length,
      totalRegistrations: report.reduce((sum, r) => sum + r.totalRegistered, 0),
      totalAttended: report.reduce((sum, r) => sum + r.totalAttended, 0),
      totalCompleted: report.reduce((sum, r) => sum + r.completed, 0),
      averageAttendanceRate: report.length > 0 ? report.reduce((sum, r) => sum + r.attendanceRate, 0) / report.length : 0,
      averageCompletionRate: report.length > 0 ? report.reduce((sum, r) => sum + r.completionRate, 0) / report.length : 0
    };

    res.json({
      localityId: parseInt(localityId),
      events: report,
      summary
    });
  } catch (error) {
    console.error('Error generating locality attendance report:', error);
    res.status(500).json({
      error: {
        message: 'Failed to generate locality attendance report',
        code: 'LOCALITY_REPORT_ERROR'
      }
    });
  }
};
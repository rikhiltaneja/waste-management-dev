import { Request, Response } from 'express';
import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();

export const getTrainingAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, localityId, districtId } = req.query;

    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.startDateTime = {};
      if (startDate) dateFilter.startDateTime.gte = new Date(startDate as string);
      if (endDate) dateFilter.startDateTime.lte = new Date(endDate as string);
    }

    const locationFilter: any = {};
    if (localityId) locationFilter.localityId = parseInt(localityId as string);
    if (districtId) locationFilter.locality = { districtId: parseInt(districtId as string) };

    const eventFilter = { ...dateFilter, ...locationFilter };

    const [
      totalEvents,
      totalRegistrations,
      totalAttendances,
      completedTrainings,
      events
    ] = await Promise.all([
      prisma.physicalTrainingEvent.count({ where: eventFilter }),
      prisma.physicalTrainingRegistration.count({
        where: {
          physicalTrainingEvent: eventFilter,
          status: 'REGISTERED'
        }
      }),
      prisma.physicalTrainingAttendance.count({
        where: {
          physicalTrainingEvent: eventFilter
        }
      }),
      prisma.physicalTrainingAttendance.count({
        where: {
          physicalTrainingEvent: eventFilter,
          completionStatus: { in: ['COMPLETED', 'CERTIFIED'] }
        }
      }),
      prisma.physicalTrainingEvent.findMany({
        where: eventFilter,
        include: {
          _count: {
            select: {
              registrations: { where: { status: 'REGISTERED' } },
              attendances: true
            }
          }
        }
      })
    ]);

    const eventAnalytics = events.map((event: any) => ({
      eventId: event.id,
      title: event.title,
      startDateTime: event.startDateTime,
      registrations: event._count.registrations,
      attendances: event._count.attendances,
      attendanceRate: event._count.registrations > 0 ? 
        (event._count.attendances / event._count.registrations * 100) : 0
    }));

    const monthlyTrends = await getMonthlyTrends(eventFilter);
    const categoryAnalytics = await getCategoryAnalytics();

    const analytics = {
      summary: {
        totalEvents,
        totalRegistrations,
        totalAttendances,
        completedTrainings,
        averageAttendanceRate: totalRegistrations > 0 ? (totalAttendances / totalRegistrations * 100) : 0,
        completionRate: totalAttendances > 0 ? (completedTrainings / totalAttendances * 100) : 0
      },
      events: eventAnalytics,
      trends: monthlyTrends,
      learningMaterials: categoryAnalytics
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching training analytics:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch training analytics',
        code: 'ANALYTICS_ERROR'
      }
    });
  }
};

const getMonthlyTrends = async (eventFilter: any) => {
  const currentYear = new Date().getFullYear();
  const months = [];

  for (let month = 0; month < 12; month++) {
    const monthStart = new Date(currentYear, month, 1);
    const monthEnd = new Date(currentYear, month + 1, 0);

    const monthFilter = {
      ...eventFilter,
      startDateTime: {
        gte: monthStart,
        lte: monthEnd
      }
    };

    const [events, registrations, attendances] = await Promise.all([
      prisma.physicalTrainingEvent.count({ where: monthFilter }),
      prisma.physicalTrainingRegistration.count({
        where: {
          physicalTrainingEvent: monthFilter,
          status: 'REGISTERED'
        }
      }),
      prisma.physicalTrainingAttendance.count({
        where: {
          physicalTrainingEvent: monthFilter
        }
      })
    ]);

    months.push({
      month: month + 1,
      monthName: monthStart.toLocaleString('default', { month: 'long' }),
      events,
      registrations,
      attendances,
      attendanceRate: registrations > 0 ? (attendances / registrations * 100) : 0
    });
  }

  return months;
};

const getCategoryAnalytics = async () => {
  const materials = await prisma.learningMaterial.findMany({
    where: { isPublished: true },
    include: {
      _count: {
        select: {
          progress: true
        }
      },
      progress: {
        where: { completedAt: { not: null } }
      }
    }
  });

  const categoryStats: { [key: string]: any } = {};

  materials.forEach((material: any) => {
    const category = material.category || 'Uncategorized';
    
    if (!categoryStats[category]) {
      categoryStats[category] = {
        totalMaterials: 0,
        totalViews: 0,
        totalCompletions: 0,
        completionRate: 0
      };
    }

    categoryStats[category].totalMaterials += 1;
    categoryStats[category].totalViews += material._count.progress;
    categoryStats[category].totalCompletions += material.progress.length;
  });

  Object.keys(categoryStats).forEach(category => {
    const stats = categoryStats[category];
    stats.completionRate = stats.totalViews > 0 ? (stats.totalCompletions / stats.totalViews * 100) : 0;
  });

  return categoryStats;
};

export const getComplianceAlerts = async (req: Request, res: Response) => {
  try {
    const { threshold = 70 } = req.query;
    const complianceThreshold = parseFloat(threshold as string);

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    const localities = await prisma.locality.findMany({
      include: {
        citizens: { select: { id: true } },
        workers: { select: { id: true } }
      }
    });

    const alerts = [];

    for (const locality of localities) {
      const totalUsers = locality.citizens.length + locality.workers.length;
      
      if (totalUsers === 0) continue;

      const compliantUsers = await prisma.physicalTrainingAttendance.count({
        where: {
          OR: [
            { citizenId: { in: locality.citizens.map((c: any) => c.id) } },
            { workerId: { in: locality.workers.map((w: any) => w.id) } }
          ],
          completionStatus: { in: ['COMPLETED', 'CERTIFIED'] },
          physicalTrainingEvent: {
            startDateTime: { gte: yearStart }
          }
        }
      });

      const complianceRate = (compliantUsers / totalUsers) * 100;

      if (complianceRate < complianceThreshold) {
        alerts.push({
          type: 'LOW_COMPLIANCE',
          localityId: locality.id,
          totalUsers,
          compliantUsers,
          complianceRate,
          severity: complianceRate < 50 ? 'HIGH' : complianceRate < 70 ? 'MEDIUM' : 'LOW',
          message: `Locality ${locality.id} has ${complianceRate.toFixed(1)}% compliance rate`
        });
      }
    }

    const upcomingDeadlines = await prisma.physicalTrainingEvent.findMany({
      where: {
        startDateTime: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        status: 'ACTIVE'
      },
      include: {
        _count: {
          select: {
            registrations: { where: { status: 'REGISTERED' } }
          }
        }
      }
    });

    const capacityAlerts = upcomingDeadlines
      .filter((event: any) => event.maxCapacity && event._count.registrations < event.maxCapacity * 0.5)
      .map((event: any) => ({
        type: 'LOW_REGISTRATION',
        eventId: event.id,
        title: event.title,
        startDateTime: event.startDateTime,
        registrations: event._count.registrations,
        maxCapacity: event.maxCapacity,
        fillRate: event.maxCapacity ? (event._count.registrations / event.maxCapacity * 100) : 0,
        severity: 'MEDIUM',
        message: `Event "${event.title}" has low registration (${event._count.registrations}/${event.maxCapacity})`
      }));

    res.json({
      complianceAlerts: alerts,
      capacityAlerts,
      summary: {
        totalAlerts: alerts.length + capacityAlerts.length,
        highSeverity: [...alerts, ...capacityAlerts].filter(a => a.severity === 'HIGH').length,
        mediumSeverity: [...alerts, ...capacityAlerts].filter(a => a.severity === 'MEDIUM').length,
        lowSeverity: [...alerts, ...capacityAlerts].filter(a => a.severity === 'LOW').length
      }
    });
  } catch (error) {
    console.error('Error fetching compliance alerts:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch compliance alerts',
        code: 'ALERTS_ERROR'
      }
    });
  }
};

export const sendComplianceReminders = async (req: Request, res: Response) => {
  try {
    const { localityId, userType } = req.body;

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    let users: any[] = [];
    
    if (userType === 'CITIZEN' || !userType) {
      const citizens = await prisma.citizen.findMany({
        where: localityId ? { localityId: parseInt(localityId) } : {}
      });
      users.push(...citizens.map((c: any) => ({ ...c, userType: 'CITIZEN' })));
    }

    if (userType === 'WORKER' || !userType) {
      const workers = await prisma.worker.findMany({
        where: localityId ? { localityId: parseInt(localityId) } : {}
      });
      users.push(...workers.map((w: any) => ({ ...w, userType: 'WORKER' })));
    }

    const nonCompliantUsers = [];

    for (const user of users) {
      const attendances = await prisma.physicalTrainingAttendance.count({
        where: {
          ...(user.userType === 'CITIZEN' ? { citizenId: user.id } : { workerId: user.id }),
          completionStatus: { in: ['COMPLETED', 'CERTIFIED'] },
          physicalTrainingEvent: {
            startDateTime: { gte: yearStart }
          }
        }
      });

      if (attendances === 0) {
        nonCompliantUsers.push({
          userId: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          phoneNumber: user.phoneNumber
        });
      }
    }

    res.json({
      message: `Compliance reminders prepared for ${nonCompliantUsers.length} users`,
      nonCompliantUsers,
      summary: {
        totalUsers: users.length,
        nonCompliantUsers: nonCompliantUsers.length,
        remindersSent: nonCompliantUsers.length
      }
    });
  } catch (error) {
    console.error('Error sending compliance reminders:', error);
    res.status(500).json({
      error: {
        message: 'Failed to send compliance reminders',
        code: 'REMINDERS_ERROR'
      }
    });
  }
};
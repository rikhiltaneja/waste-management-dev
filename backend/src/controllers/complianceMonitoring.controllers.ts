import { Request, Response } from 'express';
import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();

export const getUserComplianceStatus = async (req: Request, res: Response) => {
  try {
    const { userType, userId } = req.params;

    if (!['citizen', 'worker'].includes(userType)) {
      return res.status(400).json({
        error: {
          message: 'userType must be either citizen or worker',
          code: 'INVALID_USER_TYPE'
        }
      });
    }

    const physicalTrainingAttendances = await prisma.physicalTrainingAttendance.findMany({
      where: {
        ...(userType === 'citizen' ? { citizenId: userId } : { workerId: userId }),
        completionStatus: { in: ['COMPLETED', 'CERTIFIED'] }
      },
      include: {
        physicalTrainingEvent: {
          select: { id: true, title: true, startDateTime: true }
        }
      }
    });

    const learningProgress = await prisma.learningProgress.findMany({
      where: {
        ...(userType === 'citizen' ? { citizenId: userId } : { workerId: userId }),
        completedAt: { not: null }
      },
      include: {
        learningMaterial: {
          select: { id: true, title: true, category: true }
        }
      }
    });

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    const thisYearPhysicalTraining = physicalTrainingAttendances.filter(
      (att: any) => att.physicalTrainingEvent.startDateTime >= yearStart && 
             att.physicalTrainingEvent.startDateTime <= yearEnd
    );

    const thisYearLearning = learningProgress.filter(
      (prog: any) => prog.completedAt && prog.completedAt >= yearStart && prog.completedAt <= yearEnd
    );

    const complianceStatus = {
      userId,
      userType: userType.toUpperCase(),
      physicalTraining: {
        totalCompleted: physicalTrainingAttendances.length,
        thisYearCompleted: thisYearPhysicalTraining.length,
        isCompliant: thisYearPhysicalTraining.length >= 1,
        lastCompleted: physicalTrainingAttendances.length > 0 ? 
          physicalTrainingAttendances.sort((a: any, b: any) => 
            new Date(b.physicalTrainingEvent.startDateTime).getTime() - 
            new Date(a.physicalTrainingEvent.startDateTime).getTime()
          )[0] : null
      },
      learningMaterials: {
        totalCompleted: learningProgress.length,
        thisYearCompleted: thisYearLearning.length,
        categories: [...new Set(learningProgress.map((p: any) => p.learningMaterial.category).filter(Boolean))],
        lastCompleted: learningProgress.length > 0 ? 
          learningProgress.sort((a: any, b: any) => 
            new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
          )[0] : null
      },
      overallCompliance: {
        isCompliant: thisYearPhysicalTraining.length >= 1,
        score: Math.min(100, (thisYearPhysicalTraining.length * 50) + (thisYearLearning.length * 10)),
        nextRequirement: thisYearPhysicalTraining.length < 1 ? 'Complete mandatory physical training' : 'Continue learning'
      }
    };

    res.json(complianceStatus);
  } catch (error) {
    console.error('Error fetching user compliance status:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch user compliance status',
        code: 'COMPLIANCE_STATUS_ERROR'
      }
    });
  }
};

export const getLocalityComplianceReport = async (req: Request, res: Response) => {
  try {
    const { localityId } = req.params;

    const citizens = await prisma.citizen.findMany({
      where: { localityId: parseInt(localityId) },
      select: { id: true, name: true, email: true }
    });

    const workers = await prisma.worker.findMany({
      where: { localityId: parseInt(localityId) },
      select: { id: true, name: true, email: true }
    });

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    const citizenCompliance = await Promise.all(
      citizens.map(async (citizen: any) => {
        const attendances = await prisma.physicalTrainingAttendance.count({
          where: {
            citizenId: citizen.id,
            completionStatus: { in: ['COMPLETED', 'CERTIFIED'] },
            physicalTrainingEvent: {
              startDateTime: { gte: yearStart }
            }
          }
        });

        return {
          userId: citizen.id,
          name: citizen.name,
          email: citizen.email,
          userType: 'CITIZEN',
          completedTraining: attendances,
          isCompliant: attendances >= 1
        };
      })
    );

    const workerCompliance = await Promise.all(
      workers.map(async (worker: any) => {
        const attendances = await prisma.physicalTrainingAttendance.count({
          where: {
            workerId: worker.id,
            completionStatus: { in: ['COMPLETED', 'CERTIFIED'] },
            physicalTrainingEvent: {
              startDateTime: { gte: yearStart }
            }
          }
        });

        return {
          userId: worker.id,
          name: worker.name,
          email: worker.email,
          userType: 'WORKER',
          completedTraining: attendances,
          isCompliant: attendances >= 1
        };
      })
    );

    const allUsers = [...citizenCompliance, ...workerCompliance];
    const compliantUsers = allUsers.filter(u => u.isCompliant);
    const nonCompliantUsers = allUsers.filter(u => !u.isCompliant);

    const report = {
      localityId: parseInt(localityId),
      year: currentYear,
      summary: {
        totalUsers: allUsers.length,
        totalCitizens: citizens.length,
        totalWorkers: workers.length,
        compliantUsers: compliantUsers.length,
        nonCompliantUsers: nonCompliantUsers.length,
        complianceRate: allUsers.length > 0 ? (compliantUsers.length / allUsers.length * 100) : 0
      },
      compliantUsers,
      nonCompliantUsers
    };

    res.json(report);
  } catch (error) {
    console.error('Error generating locality compliance report:', error);
    res.status(500).json({
      error: {
        message: 'Failed to generate locality compliance report',
        code: 'LOCALITY_COMPLIANCE_ERROR'
      }
    });
  }
};

export const getDistrictComplianceReport = async (req: Request, res: Response) => {
  try {
    const { districtId } = req.params;

    const localities = await prisma.locality.findMany({
      where: { districtId: parseInt(districtId) },
      include: {
        citizens: { select: { id: true } },
        workers: { select: { id: true } }
      }
    });

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    const localityReports = await Promise.all(
      localities.map(async (locality: any) => {
        const totalUsers = locality.citizens.length + locality.workers.length;
        
        const compliantCitizens = await prisma.physicalTrainingAttendance.count({
          where: {
            citizenId: { in: locality.citizens.map((c: any) => c.id) },
            completionStatus: { in: ['COMPLETED', 'CERTIFIED'] },
            physicalTrainingEvent: {
              startDateTime: { gte: yearStart }
            }
          }
        });

        const compliantWorkers = await prisma.physicalTrainingAttendance.count({
          where: {
            workerId: { in: locality.workers.map((w: any) => w.id) },
            completionStatus: { in: ['COMPLETED', 'CERTIFIED'] },
            physicalTrainingEvent: {
              startDateTime: { gte: yearStart }
            }
          }
        });

        const totalCompliant = compliantCitizens + compliantWorkers;

        return {
          localityId: locality.id,
          totalUsers,
          totalCitizens: locality.citizens.length,
          totalWorkers: locality.workers.length,
          compliantUsers: totalCompliant,
          complianceRate: totalUsers > 0 ? (totalCompliant / totalUsers * 100) : 0
        };
      })
    );

    const districtSummary = {
      totalUsers: localityReports.reduce((sum, r) => sum + r.totalUsers, 0),
      totalCitizens: localityReports.reduce((sum, r) => sum + r.totalCitizens, 0),
      totalWorkers: localityReports.reduce((sum, r) => sum + r.totalWorkers, 0),
      compliantUsers: localityReports.reduce((sum, r) => sum + r.compliantUsers, 0),
      averageComplianceRate: localityReports.length > 0 ? 
        localityReports.reduce((sum, r) => sum + r.complianceRate, 0) / localityReports.length : 0
    };

    res.json({
      districtId: parseInt(districtId),
      year: currentYear,
      summary: districtSummary,
      localities: localityReports
    });
  } catch (error) {
    console.error('Error generating district compliance report:', error);
    res.status(500).json({
      error: {
        message: 'Failed to generate district compliance report',
        code: 'DISTRICT_COMPLIANCE_ERROR'
      }
    });
  }
};
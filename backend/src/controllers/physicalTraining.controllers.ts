import { Request, Response } from 'express';
import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     PhysicalTrainingEvent:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - startDateTime
 *         - location
 *         - targetAudience
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         title:
 *           type: string
 *           description: Training event title
 *         description:
 *           type: string
 *           description: Training event description
 *         startDateTime:
 *           type: string
 *           format: date-time
 *           description: Start date and time
 *         endDateTime:
 *           type: string
 *           format: date-time
 *           description: End date and time (optional)
 *         location:
 *           type: string
 *           description: Physical location of the training
 *         maxCapacity:
 *           type: integer
 *           description: Maximum number of participants
 *         targetAudience:
 *           type: array
 *           items:
 *             type: string
 *             enum: [CITIZEN, WORKER, DISTRICT_ADMIN, LOCALITY_ADMIN]
 *         status:
 *           type: string
 *           enum: [ACTIVE, CANCELLED, COMPLETED, DRAFT]
 *         localityId:
 *           type: integer
 *           description: Associated locality ID
 */

/**
 * @swagger
 * /api/physical-training-events:
 *   get:
 *     summary: Get all physical training events
 *     tags: [Physical Training Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, CANCELLED, COMPLETED, DRAFT]
 *         description: Filter by status
 *       - in: query
 *         name: localityId
 *         schema:
 *           type: integer
 *         description: Filter by locality
 *       - in: query
 *         name: targetAudience
 *         schema:
 *           type: string
 *           enum: [CITIZEN, WORKER, DISTRICT_ADMIN, LOCALITY_ADMIN]
 *         description: Filter by target audience
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter events from this date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter events until this date
 *     responses:
 *       200:
 *         description: List of physical training events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PhysicalTrainingEvent'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
export const getPhysicalTrainingEvents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const { status, localityId, targetAudience, search, dateFrom, dateTo } = req.query;
    
    // Build filter conditions
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (localityId) {
      where.localityId = parseInt(localityId as string);
    }
    
    if (targetAudience) {
      where.targetAudience = {
        has: targetAudience
      };
    }
    
    // Search functionality
    if (search) {
      where.OR = [
        {
          title: {
            contains: search as string,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search as string,
            mode: 'insensitive'
          }
        }
      ];
    }
    
    // Date range filtering
    if (dateFrom || dateTo) {
      where.startDateTime = {};
      if (dateFrom) {
        where.startDateTime.gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        where.startDateTime.lte = new Date(dateTo as string);
      }
    }
    
    const [events, total] = await Promise.all([
      prisma.physicalTrainingEvent.findMany({
        where,
        skip,
        take: limit,
        include: {
          locality: {
            select: {
              id: true,
              district: {
                select: {
                  id: true
                }
              }
            }
          },
          createdByDistrictAdmin: {
            select: {
              id: true,
              name: true
            }
          },
          createdByLocalityAdmin: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              registrations: true
            }
          }
        },
        orderBy: {
          startDateTime: 'asc'
        }
      }),
      prisma.physicalTrainingEvent.count({ where })
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching physical training events:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch physical training events',
        code: 'FETCH_EVENTS_ERROR'
      }
    });
  }
};

// Additional controller methods would go here...
// (createPhysicalTrainingEvent, updatePhysicalTrainingEvent, etc.)
import { Router } from 'express';
import { getPhysicalTrainingEvents } from '../controllers/physicalTraining.controllers';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Physical Training Events
 *   description: Physical training event management endpoints
 */

/**
 * @swagger
 * /physical-training:
 *   get:
 *     summary: Get all physical training events
 *     tags: [Physical Training Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of events per page
 *       - in: query
 *         name: locality
 *         schema:
 *           type: integer
 *         description: Filter by locality ID
 *       - in: query
 *         name: district
 *         schema:
 *           type: integer
 *         description: Filter by district ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, ONGOING, COMPLETED, CANCELLED]
 *         description: Filter by event status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in event title and description
 *     responses:
 *       200:
 *         description: List of physical training events with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
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
router.get('/', getPhysicalTrainingEvents);

export default router;
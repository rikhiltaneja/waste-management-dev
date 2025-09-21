import { Router } from 'express';
import { getUserRegistrations } from '../controllers/physicalTrainingRegistration.controllers';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User Registrations
 *   description: User training registration history endpoints
 */

/**
 * @swagger
 * /user-registrations/{userType}/{userId}/registrations:
 *   get:
 *     summary: Get all registrations for a user
 *     tags: [User Registrations]
 *     parameters:
 *       - in: path
 *         name: userType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [CITIZEN, WORKER]
 *         description: Type of user
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [REGISTERED, ATTENDED, COMPLETED, CANCELLED]
 *         description: Filter by registration status
 *       - in: query
 *         name: upcoming
 *         schema:
 *           type: boolean
 *         description: Filter for upcoming events only
 *     responses:
 *       200:
 *         description: List of user registrations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   physicalTrainingEvent:
 *                     type: object
 *                   registrationDate:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *       404:
 *         description: User not found
 */
router.get('/:userType/:userId/registrations', getUserRegistrations);

export default router;
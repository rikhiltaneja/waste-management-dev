import { Router } from 'express';
import {
  registerForEvent,
  cancelRegistration,
  getUserRegistrations,
  getEventRegistrations
} from '../controllers/physicalTrainingRegistration.controllers';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Physical Training Registration
 *   description: Physical training event registration management endpoints
 */

/**
 * @swagger
 * /physical-training-registration/{eventId}/register:
 *   post:
 *     summary: Register for a physical training event
 *     tags: [Physical Training Registration]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Physical training event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userType
 *               - userId
 *             properties:
 *               userType:
 *                 type: string
 *                 enum: [CITIZEN, WORKER]
 *                 description: Type of user registering
 *               userId:
 *                 type: string
 *                 description: User ID (citizen or worker)
 *     responses:
 *       201:
 *         description: Successfully registered for event
 *       400:
 *         description: Event is full, already registered, or invalid data
 *       404:
 *         description: Event or user not found
 */
router.post('/:eventId/register', registerForEvent);

/**
 * @swagger
 * /physical-training-registration/{eventId}/register:
 *   delete:
 *     summary: Cancel registration for a physical training event
 *     tags: [Physical Training Registration]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Physical training event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userType
 *               - userId
 *             properties:
 *               userType:
 *                 type: string
 *                 enum: [CITIZEN, WORKER]
 *                 description: Type of user canceling registration
 *               userId:
 *                 type: string
 *                 description: User ID (citizen or worker)
 *     responses:
 *       200:
 *         description: Successfully canceled registration
 *       404:
 *         description: Registration not found
 */
router.delete('/:eventId/register', cancelRegistration);

/**
 * @swagger
 * /physical-training-registration/{eventId}/registrations:
 *   get:
 *     summary: Get all registrations for a physical training event (Admin only)
 *     tags: [Physical Training Registration]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Physical training event ID
 *     responses:
 *       200:
 *         description: List of registrations for the event
 *       404:
 *         description: Event not found
 */
router.get('/:eventId/registrations', getEventRegistrations);

export default router;
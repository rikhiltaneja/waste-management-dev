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

// POST /api/physical-training-events/:eventId/register - Register for training event
router.post('/:eventId/register', registerForEvent);

// DELETE /api/physical-training-events/:eventId/register - Cancel registration
router.delete('/:eventId/register', cancelRegistration);

// GET /api/physical-training-events/:eventId/registrations - Get event registrations (admin)
router.get('/:eventId/registrations', getEventRegistrations);

export default router;
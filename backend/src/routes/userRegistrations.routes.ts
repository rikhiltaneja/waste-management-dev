import { Router } from 'express';
import { getUserRegistrations } from '../controllers/physicalTrainingRegistration.controllers';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User Registrations
 *   description: User training registration history endpoints
 */

// GET /api/users/:userType/:userId/registrations - Get user's registrations
router.get('/:userType/:userId/registrations', getUserRegistrations);

export default router;
import { Router } from 'express';
import { 
  getPhysicalTrainingEvents,
  createPhysicalTrainingEvent,
  updatePhysicalTrainingEvent,
  getPhysicalTrainingEventById,
  deletePhysicalTrainingEvent
} from '../controllers/physicalTraining.controllers';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Physical Training Events
 *   description: Physical training event management endpoints
 */

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
 *           enum: [ACTIVE, CANCELLED, COMPLETED, DRAFT]
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

/**
 * @swagger
 * /physical-training:
 *   post:
 *     summary: Create a new physical training event
 *     tags: [Physical Training Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - startDateTime
 *               - location
 *               - targetAudience
 *               - localityId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Training event title
 *               description:
 *                 type: string
 *                 description: Training event description
 *               startDateTime:
 *                 type: string
 *                 format: date-time
 *                 description: Start date and time
 *               endDateTime:
 *                 type: string
 *                 format: date-time
 *                 description: End date and time (optional)
 *               location:
 *                 type: string
 *                 description: Physical location of the training
 *               maxCapacity:
 *                 type: integer
 *                 description: Maximum number of participants
 *               targetAudience:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [CITIZEN, WORKER, DISTRICT_ADMIN, LOCALITY_ADMIN]
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, CANCELLED, COMPLETED, DRAFT]
 *                 default: ACTIVE
 *               localityId:
 *                 type: integer
 *                 description: Associated locality ID
 *               createdByDistrictAdminId:
 *                 type: string
 *                 description: District admin ID (if created by district admin)
 *               createdByLocalityAdminId:
 *                 type: string
 *                 description: Locality admin ID (if created by locality admin)
 *     responses:
 *       201:
 *         description: Physical training event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PhysicalTrainingEvent'
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /physical-training/{id}:
 *   get:
 *     summary: Get a specific physical training event by ID
 *     tags: [Physical Training Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Physical training event ID
 *     responses:
 *       200:
 *         description: Physical training event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PhysicalTrainingEvent'
 *       404:
 *         description: Physical training event not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /physical-training/{id}:
 *   put:
 *     summary: Update a physical training event
 *     tags: [Physical Training Events]
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               title:
 *                 type: string
 *                 description: Training event title
 *               description:
 *                 type: string
 *                 description: Training event description
 *               startDateTime:
 *                 type: string
 *                 format: date-time
 *                 description: Start date and time
 *               endDateTime:
 *                 type: string
 *                 format: date-time
 *                 description: End date and time (optional)
 *               location:
 *                 type: string
 *                 description: Physical location of the training
 *               maxCapacity:
 *                 type: integer
 *                 description: Maximum number of participants
 *               targetAudience:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [CITIZEN, WORKER, DISTRICT_ADMIN, LOCALITY_ADMIN]
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, CANCELLED, COMPLETED, DRAFT]
 *               localityId:
 *                 type: integer
 *                 description: Associated locality ID
 *     responses:
 *       200:
 *         description: Physical training event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PhysicalTrainingEvent'
 *       400:
 *         description: Bad request - validation error
 *       404:
 *         description: Physical training event not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /physical-training/{id}:
 *   delete:
 *     summary: Delete a physical training event
 *     tags: [Physical Training Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Physical training event ID
 *     responses:
 *       200:
 *         description: Physical training event deleted successfully
 *       404:
 *         description: Physical training event not found
 *       500:
 *         description: Internal server error
 */
router.get('/', getPhysicalTrainingEvents);
router.post('/', createPhysicalTrainingEvent);
router.get('/:id', getPhysicalTrainingEventById);
router.put('/:id', updatePhysicalTrainingEvent);
router.delete('/:id', deletePhysicalTrainingEvent);

export default router;
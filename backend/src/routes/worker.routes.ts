import express from 'express';
import multer from "multer";
import {
  createWorker,
  getWorkerProfile,
  getAssignedComplaints,
  updateWorkerIncentive,
  resolveComplaintWithPhoto,
  deleteWorker
} from '../controllers/worker.controller';

export const workerRouter = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * tags:
 *   name: Workers
 *   description: Worker management APIs
 */

/**
 * @swagger
 * /workers/create:
 *   post:
 *     summary: Create a new worker
 *     tags: [Workers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, name, phoneNumber, email, localityId, workerType]
 *             properties:
 *               id: { type: string }
 *               name: { type: string }
 *               phoneNumber: { type: string }
 *               email: { type: string }
 *               localityId: { type: integer }
 *               workerType:
 *                 type: string
 *                 enum: [WASTE_COLLECTOR, SWEEPER]
 *                 description: "Type of worker - must match Prisma enum values"
 *     responses:
 *       201:
 *         description: Worker created successfully
 *       400:
 *         description: Invalid input data
 */
workerRouter.post('/create', createWorker);

/**
 * @swagger
 * /workers/{id}:
 *   get:
 *     summary: Get worker profile
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: "Worker ID "
 *     responses:
 *       200:
 *         description: Worker profile
 */
workerRouter.get('/:id', getWorkerProfile);

/**
 * @swagger
 * /workers/{id}/complaints:
 *   get:
 *     summary: Get assigned complaints for worker
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: "Worker ID "
 *     responses:
 *       200:
 *         description: List of complaints
 */
workerRouter.get('/:id/complaints', getAssignedComplaints);

/**
 * @swagger
 * /workers/{id}/incentive:
 *   put:
 *     summary: Update worker incentive/bonus
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: "Worker ID "
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bonus]
 *             properties:
 *               bonus: { type: number }
 *     responses:
 *       200:
 *         description: Incentive updated
 */
workerRouter.put('/:id/incentive', updateWorkerIncentive);

/**
 * @swagger
 * /workers/{id}/resolve:
 *   post:
 *     summary: Resolve complaint with photo upload
 *     tags: [Workers]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: "Worker ID "
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [complaintId, WorkDoneImage]
 *             properties:
 *               complaintId: { type: integer }
 *               WorkDoneImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Complaint resolved successfully
 *       400:
 *         description: File or complaintId required
 *       403:
 *         description: Complaint not assigned to this worker
 *       404:
 *         description: Complaint not found
 */
workerRouter.post("/:id/resolve", upload.single("WorkDoneImage"), resolveComplaintWithPhoto);

/**
 * @swagger
 * /workers/{id}:
 *   delete:
 *     summary: Delete worker
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: "Worker ID "
 *     responses:
 *       200:
 *         description: Worker deleted successfully
 *       404:
 *         description: Worker not found
 */
workerRouter.delete('/:id', deleteWorker);
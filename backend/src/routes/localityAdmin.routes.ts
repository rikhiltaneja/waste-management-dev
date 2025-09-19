import express from 'express';
import { createLocalityAdmin, getLocalityAdminProfile, assignWorkerToComplaint, getLocalityComplaints, getLocalityWorkers, deleteLocalityAdmin } from '../controllers/localityAdmin.controller';
export const localityAdminRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: LocalityAdmins
 *   description: Locality Admin management APIs
 */

/**
 * @swagger
 * /locality-admins/create:
 *   post:
 *     summary: Create a new locality admin
 *     tags: [LocalityAdmins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [govtId, name, phoneNumber, email, localityId]
 *             properties:
 *               govtId: { type: string }
 *               name: { type: string }
 *               phoneNumber: { type: string}
 *               email: { type: string }
 *               localityId: { type: integer }
 *     responses:
 *       201:
 *         description: Locality admin created
 */
localityAdminRouter.post('/create', createLocalityAdmin);

/**
 * @swagger
 * /locality-admins/{id}:
 *   get:
 *     summary: Get locality admin profile
 *     tags: [LocalityAdmins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: "Locality Admin ID"
 *     responses:
 *       200:
 *         description: Locality admin profile
 */
localityAdminRouter.get('/:id', getLocalityAdminProfile);

/**
 * @swagger
 * /locality-admins/complaints/{complaintId}/assign:
 *   put:
 *     summary: Assign a complaint to worker
 *     tags: [LocalityAdmins]
 *     parameters:
 *       - in: path
 *         name: complaintId
 *         required: true
 *         schema: { type: integer }
 *         description: "Complaint ID"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [workerId, localityAdminId]
 *             properties:
 *               workerId: { type: integer, description: "ID of the worker to assign" }
 *               localityAdminId: { type: integer, description: "ID of the locality admin making the assignment" }
 *     responses:
 *       200:
 *         description: Worker assigned to complaint
 */
localityAdminRouter.put('/complaints/:complaintId/assign', assignWorkerToComplaint);

/**
 * @swagger
 * /locality-admins/{id}/complaints:
 *   get:
 *     summary: Get all complaints in locality
 *     tags: [LocalityAdmins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: "Locality Admin ID"
 *     responses:
 *       200:
 *         description: List of complaints in locality
 */
localityAdminRouter.get('/:id/complaints', getLocalityComplaints);

/**
 * @swagger
 * /locality-admins/{id}/workers:
 *   get:
 *     summary: Get all workers under locality admin
 *     tags: [LocalityAdmins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: "Locality Admin ID"
 *     responses:
 *       200:
 *         description: List of workers in locality
 */
localityAdminRouter.get('/:id/workers', getLocalityWorkers);

/**
 * @swagger
 * /locality-admins/{id}:
 *   delete:
 *     summary: Delete locality admin
 *     tags: [LocalityAdmins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: "Locality Admin ID"
 *     responses:
 *       200:
 *         description: Locality admin deleted successfully
 *       404:
 *         description: Locality admin not found
 */
localityAdminRouter.delete('/:id', deleteLocalityAdmin);

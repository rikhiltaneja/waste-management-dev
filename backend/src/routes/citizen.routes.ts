import express from 'express';
import {
  createCitizen,
  getCitizenProfile,
  getCitizenComplaints,
  updateCitizenPoints,
  updateCitizenReview,
  getCitizenComplaintStatus,
  deleteCitizen,
} from '../controllers/citizen.controller';
export const citizenRouter = express.Router();

citizenRouter.use(express.json());

/**
 * @swagger
 * tags:
 *   name: Citizens
 *   description: Citizen management APIs
 */

/**
 * @swagger
 * /citizens/create:
 *   post:
 *     summary: Create a new citizen
 *     tags: [Citizens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, name, phoneNumber, email, localityId]
 *             properties:
 *               id: { type: string }
 *               name: { type: string }
 *               phoneNumber: { type: string }
 *               email: { type: string }
 *               localityId: { type: integer }
 *     responses:
 *       201:
 *         description: Citizen created successfully
 */
citizenRouter.post('/create', createCitizen);

/**
 * @swagger
 * /citizens/{id}:
 *   get:
 *     summary: Get citizen profile
 *     tags: [Citizens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: "Citizen ID "
 *     responses:
 *       200:
 *         description: Citizen profile
 */
citizenRouter.get('/:id', getCitizenProfile);

/**
 * @swagger
 * /citizens/{id}/complaints:
 *   get:
 *     summary: Get all complaints of citizen
 *     tags: [Citizens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: "Citizen ID "
 *     responses:
 *       200:
 *         description: List of complaints
 */
citizenRouter.get('/:id/complaints', getCitizenComplaints);

/**
 * @swagger
 * /citizens/{id}/points:
 *   put:
 *     summary: Update citizen points
 *     tags: [Citizens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: "Citizen ID "
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [points]
 *             properties:
 *               points: { type: integer }
 *     responses:
 *       200:
 *         description: Points updated
 */
citizenRouter.put('/:id/points', updateCitizenPoints);

/**
 * @swagger
 * /citizens/{id}/review:
 *   put:
 *     summary: Update review for a resolved complaint
 *     tags: [Citizens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: "Citizen ID "
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [complaintId, review, rating]
 *             properties:
 *               complaintId: { type: integer }
 *               review: { type: string }
 *               rating: { type: number, description: "Rating for the resolved complaint" }
 *     responses:
 *       200:
 *         description: Review updated
 */
citizenRouter.put('/:id/review', updateCitizenReview);

/**
 * @swagger
 * /citizens/{id}/complaint-status:
 *   get:
 *     summary: Track status of all complaints for citizen
 *     tags: [Citizens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: "Citizen ID "
 *     responses:
 *       200:
 *         description: List of complaints with status tracking
 */
citizenRouter.get('/:id/complaint-status', getCitizenComplaintStatus);

/**
 * @swagger
 * /citizens/{id}:
 *   delete:
 *     summary: Delete citizen
 *     tags: [Citizens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: "Citizen ID "
 *     responses:
 *       200:
 *         description: Citizen deleted successfully
 *       400:
 *         description: Cannot delete citizen with associated complaints
 *       404:
 *         description: Citizen not found
 */
citizenRouter.delete('/:id', deleteCitizen);
import express from 'express';
import { createDistrictAdmin, getDistrictAdminProfile, getDistrictComplaints, getDistrictLocalityAdmins, deleteDistrictAdmin } from '../controllers/districtAdmin.controller';

export const districtAdminRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: DistrictAdmins
 *   description: District Admin management APIs
 */

/**
 * @swagger
 * /district-admins/create:
 *   post:
 *     summary: Create a new district admin
 *     tags: [DistrictAdmins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [govtId, name, phoneNumber, email, districtId]
 *             properties:
 *               govtId: { type: string }
 *               name: { type: string }
 *               phoneNumber: { type: string}
 *               email: { type: string }
 *               districtId: { type: integer }
 *     responses:
 *       201:
 *         description: District admin created
 */
districtAdminRouter.post('/create', createDistrictAdmin);

/**
 * @swagger
 * /district-admins/{id}:
 *   get:
 *     summary: Get district admin profile
 *     tags: [DistrictAdmins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: "District Admin ID"
 *     responses:
 *       200:
 *         description: District admin profile
 */
districtAdminRouter.get('/:id', getDistrictAdminProfile);

/**
 * @swagger
 * /district-admins/{id}/complaints:
 *   get:
 *     summary: Get all complaints in district
 *     tags: [DistrictAdmins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: "District Admin ID"
 *     responses:
 *       200:
 *         description: List of complaints in district
 */
districtAdminRouter.get('/:id/complaints', getDistrictComplaints);

/**
 * @swagger
 * /district-admins/{id}/locality-admins:
 *   get:
 *     summary: Get all locality admins under district admin
 *     tags: [DistrictAdmins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: "District Admin ID"
 *     responses:
 *       200:
 *         description: List of locality admins in district
 */
districtAdminRouter.get('/:id/locality-admins', getDistrictLocalityAdmins);

/**
 * @swagger
 * /district-admins/{id}:
 *   delete:
 *     summary: Delete district admin
 *     tags: [DistrictAdmins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: "District Admin ID"
 *     responses:
 *       200:
 *         description: District admin deleted successfully
 *       404:
 *         description: District admin not found
 */
districtAdminRouter.delete('/:id', deleteDistrictAdmin);

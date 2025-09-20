import { Router } from "express";
import multer from "multer";
import {
  createComplaint,
  deleteComplaint
} from "../controllers/complaint.controller";

const complaintRouter = Router();
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: Complaint management APIs
 */

/**
 * @swagger
 * /complaints/create:
 *   post:
 *     summary: Create complaint
 *     tags: [Complaints]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - citizenId
 *               - complaintImage
 *             properties:
 *               description:
 *                 type: string
 *                 description: "Description of the complaint"
 *               complaintImage:
 *                 type: string
 *                 format: binary
 *                 description: "Image depicting the complaint"
 *               citizenId:
 *                 type: string
 *                 description: "Clerk user ID of the citizen creating the complaint"
 *     responses:
 *       201: 
 *         description: Complaint created and automatically assigned to locality admin
 *       400:
 *         description: Missing required fields, image not uploaded, or no locality admin assigned
 *       404:
 *         description: Citizen not found
 *       500:
 *         description: Internal server error
 */
complaintRouter.post("/create", upload.single("complaintImage"), createComplaint);

/**
 * @swagger
 * /complaints/{id}:
 *   delete:
 *     summary: Delete complaint
 *     tags: [Complaints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: "Complaint ID (remains as integer auto-increment)"
 *     responses:
 *       200:
 *         description: Complaint deleted successfully
 *       404:
 *         description: Complaint not found
 */
complaintRouter.delete("/:id", deleteComplaint);

export default complaintRouter;
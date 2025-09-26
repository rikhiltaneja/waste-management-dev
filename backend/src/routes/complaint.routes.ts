import { Router } from "express";
import multer from "multer";
import {
  createComplaint,
  deleteComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus
} from "../controllers/complaint.controller";
import { authenticationCheck } from '../middlewares/authorization/general.auth';
import { allAdmins, allUserTypes, onlyCitizens } from '../middlewares/authorization/role-based.auth';

const complaintRouter = Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: Complaint management APIs
 */

/**
 * @swagger
 * /complaints:
 *   get:
 *     summary: Get complaints based on user role
 *     tags: [Complaints]
 *     security:
 *       - BearerAuth: []
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
 *         description: Number of complaints per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, RESOLVED]
 *         description: Filter by complaint status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in complaint description
 *     responses:
 *       200:
 *         description: List of complaints with pagination (filtered by role)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 complaints:
 *                   type: array
 *                   items:
 *                     type: object
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
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied for this role
 *       500:
 *         description: Internal server error
 */
complaintRouter.get("/", authenticationCheck, allUserTypes, getComplaints);

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
 *               - complaintImage
 *             properties:
 *               description:
 *                 type: string
 *                 description: "Description of the complaint"
 *               complaintImage:
 *                 type: string
 *                 format: binary
 *                 description: "Image depicting the complaint"

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
complaintRouter.post("/create", authenticationCheck, onlyCitizens, upload.single("complaintImage"), createComplaint);

/**
 * @swagger
 * /complaints/{id}:
 *   get:
 *     summary: Get a specific complaint by ID
 *     tags: [Complaints]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Complaint ID
 *     responses:
 *       200:
 *         description: Complaint details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid complaint ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied to view this complaint
 *       404:
 *         description: Complaint not found
 *       500:
 *         description: Internal server error
 */
complaintRouter.get("/:id", authenticationCheck, allUserTypes, getComplaintById);

/**
 * @swagger
 * /complaints/{id}/status:
 *   put:
 *     summary: Update complaint status (Admin/LocalityAdmin only)
 *     tags: [Complaints]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Complaint ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, RESOLVED]
 *                 description: New status for the complaint
 *               assignedWorkerId:
 *                 type: string
 *                 description: Worker ID to assign the complaint to
 *     responses:
 *       200:
 *         description: Complaint status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid complaint ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied to update complaint status
 *       404:
 *         description: Complaint not found
 *       500:
 *         description: Internal server error
 */
complaintRouter.put("/:id/status", authenticationCheck, allAdmins, updateComplaintStatus);

/**
 * @swagger
 * /complaints/{id}:
 *   delete:
 *     summary: Delete complaint
 *     tags: [Complaints]
 *     security:
 *       - BearerAuth: []
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
complaintRouter.delete("/:id", authenticationCheck, allAdmins, deleteComplaint);

export default complaintRouter;
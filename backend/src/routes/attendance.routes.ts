import { Router } from 'express';
import { markAttendance, getEventAttendance, generateCertificate } from '../controllers/physicalTrainingAttendance.controllers';
import { getAttendanceStatistics, getMissedTrainingUsers, getLocalityAttendanceReport } from '../controllers/attendanceReporting.controllers';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Physical training attendance management endpoints
 */

/**
 * @swagger
 * /attendance/events/{eventId}/attendance:
 *   post:
 *     summary: Mark attendance for a physical training event
 *     tags: [Attendance]
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
 *               - status
 *             properties:
 *               userType:
 *                 type: string
 *                 enum: [CITIZEN, WORKER]
 *               userId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PRESENT, ABSENT, LATE]
 *               completionStatus:
 *                 type: string
 *                 enum: [COMPLETED, INCOMPLETE, CERTIFIED]
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 *       400:
 *         description: Invalid data or user not registered
 */
router.post('/events/:eventId/attendance', markAttendance);

/**
 * @swagger
 * /attendance/events/{eventId}/attendance:
 *   get:
 *     summary: Get attendance records for an event
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Physical training event ID
 *     responses:
 *       200:
 *         description: List of attendance records
 */
router.get('/events/:eventId/attendance', getEventAttendance);

/**
 * @swagger
 * /attendance/events/{eventId}/certificate:
 *   post:
 *     summary: Generate certificate for completed training
 *     tags: [Attendance]
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
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Certificate generated successfully
 */
router.post('/events/:eventId/certificate', generateCertificate);

/**
 * @swagger
 * /attendance/events/{eventId}/statistics:
 *   get:
 *     summary: Get attendance statistics for an event
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Physical training event ID
 *     responses:
 *       200:
 *         description: Attendance statistics
 */
router.get('/events/:eventId/statistics', getAttendanceStatistics);

/**
 * @swagger
 * /attendance/events/{eventId}/missed-users:
 *   get:
 *     summary: Get users who missed the training event
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Physical training event ID
 *     responses:
 *       200:
 *         description: List of users who missed the event
 */
router.get('/events/:eventId/missed-users', getMissedTrainingUsers);

/**
 * @swagger
 * /attendance/localities/{localityId}/attendance-report:
 *   get:
 *     summary: Get attendance report for a locality
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: localityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Locality ID
 *     responses:
 *       200:
 *         description: Locality attendance report
 */
router.get('/localities/:localityId/attendance-report', getLocalityAttendanceReport);

export default router;
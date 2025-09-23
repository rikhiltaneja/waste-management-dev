import { Router } from 'express';
import { 
  getUserComplianceStatus, 
  getLocalityComplianceReport, 
  getDistrictComplianceReport 
} from '../controllers/complianceMonitoring.controllers';
import { 
  getTrainingAnalytics, 
  getComplianceAlerts, 
  sendComplianceReminders 
} from '../controllers/trainingAnalytics.controllers';
import { getUserLearningProgress } from '../controllers/learningProgress.controllers';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Compliance
 *   description: Training compliance monitoring and analytics endpoints
 */

/**
 * @swagger
 * /compliance/users/{userType}/{userId}:
 *   get:
 *     summary: Get compliance status for a user
 *     tags: [Compliance]
 *     parameters:
 *       - in: path
 *         name: userType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [CITIZEN, WORKER]
 *         description: Type of user
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User compliance status
 *       404:
 *         description: User not found
 */
router.get('/users/:userType/:userId', getUserComplianceStatus);

/**
 * @swagger
 * /compliance/users/{userType}/{userId}/progress:
 *   get:
 *     summary: Get learning progress for a user
 *     tags: [Compliance]
 *     parameters:
 *       - in: path
 *         name: userType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [CITIZEN, WORKER]
 *         description: Type of user
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User learning progress
 */
router.get('/users/:userType/:userId/progress', getUserLearningProgress);

/**
 * @swagger
 * /compliance/localities/{localityId}:
 *   get:
 *     summary: Get compliance report for a locality
 *     tags: [Compliance]
 *     parameters:
 *       - in: path
 *         name: localityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Locality ID
 *     responses:
 *       200:
 *         description: Locality compliance report
 */
router.get('/localities/:localityId', getLocalityComplianceReport);

/**
 * @swagger
 * /compliance/districts/{districtId}:
 *   get:
 *     summary: Get compliance report for a district
 *     tags: [Compliance]
 *     parameters:
 *       - in: path
 *         name: districtId
 *         required: true
 *         schema:
 *           type: integer
 *         description: District ID
 *     responses:
 *       200:
 *         description: District compliance report
 */
router.get('/districts/:districtId', getDistrictComplianceReport);

/**
 * @swagger
 * /compliance/analytics:
 *   get:
 *     summary: Get training analytics and insights
 *     tags: [Compliance]
 *     responses:
 *       200:
 *         description: Training analytics data
 */
router.get('/analytics', getTrainingAnalytics);

/**
 * @swagger
 * /compliance/alerts:
 *   get:
 *     summary: Get compliance alerts
 *     tags: [Compliance]
 *     responses:
 *       200:
 *         description: List of compliance alerts
 */
router.get('/alerts', getComplianceAlerts);

/**
 * @swagger
 * /compliance/reminders:
 *   post:
 *     summary: Send compliance reminders
 *     tags: [Compliance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               localityId:
 *                 type: integer
 *               districtId:
 *                 type: integer
 *               userType:
 *                 type: string
 *                 enum: [CITIZEN, WORKER]
 *     responses:
 *       200:
 *         description: Reminders sent successfully
 */
router.post('/reminders', sendComplianceReminders);

export default router;
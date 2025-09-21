import { Router } from 'express';
import { 
  createLearningMaterial, 
  getLearningMaterials, 
  getLearningMaterialById, 
  updateLearningMaterial, 
  deleteLearningMaterial 
} from '../controllers/learningMaterials.controllers';
import { 
  startLearningMaterial, 
  updateLearningProgress, 
  getUserLearningProgress, 
  getMaterialProgress 
} from '../controllers/learningProgress.controllers';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Learning Materials
 *   description: Learning materials and progress management endpoints
 */

/**
 * @swagger
 * /learning-materials:
 *   post:
 *     summary: Create a new learning material (Admin only)
 *     tags: [Learning Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - content
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [VIDEO, DOCUMENT, INTERACTIVE, QUIZ]
 *               category:
 *                 type: string
 *               estimatedDuration:
 *                 type: integer
 *               isRequired:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Learning material created successfully
 */
router.post('/', createLearningMaterial);

/**
 * @swagger
 * /learning-materials:
 *   get:
 *     summary: Get all learning materials
 *     tags: [Learning Materials]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [VIDEO, DOCUMENT, INTERACTIVE, QUIZ]
 *         description: Filter by material type
 *       - in: query
 *         name: required
 *         schema:
 *           type: boolean
 *         description: Filter by required status
 *     responses:
 *       200:
 *         description: List of learning materials
 */
router.get('/', getLearningMaterials);

/**
 * @swagger
 * /learning-materials/{id}:
 *   get:
 *     summary: Get learning material by ID
 *     tags: [Learning Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Learning material ID
 *     responses:
 *       200:
 *         description: Learning material details
 *       404:
 *         description: Learning material not found
 */
router.get('/:id', getLearningMaterialById);

/**
 * @swagger
 * /learning-materials/{id}:
 *   put:
 *     summary: Update learning material (Admin only)
 *     tags: [Learning Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Learning material ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               estimatedDuration:
 *                 type: integer
 *               isRequired:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Learning material updated successfully
 *       404:
 *         description: Learning material not found
 */
router.put('/:id', updateLearningMaterial);

/**
 * @swagger
 * /learning-materials/{id}:
 *   delete:
 *     summary: Delete learning material (Admin only)
 *     tags: [Learning Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Learning material ID
 *     responses:
 *       200:
 *         description: Learning material deleted successfully
 *       404:
 *         description: Learning material not found
 */
router.delete('/:id', deleteLearningMaterial);

/**
 * @swagger
 * /learning-materials/{materialId}/start:
 *   post:
 *     summary: Start learning a material
 *     tags: [Learning Materials]
 *     parameters:
 *       - in: path
 *         name: materialId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Learning material ID
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
 *       201:
 *         description: Learning progress started
 */
router.post('/:materialId/start', startLearningMaterial);

/**
 * @swagger
 * /learning-materials/{materialId}/progress:
 *   put:
 *     summary: Update learning progress
 *     tags: [Learning Materials]
 *     parameters:
 *       - in: path
 *         name: materialId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Learning material ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userType
 *               - userId
 *               - progressPercentage
 *             properties:
 *               userType:
 *                 type: string
 *                 enum: [CITIZEN, WORKER]
 *               userId:
 *                 type: string
 *               progressPercentage:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *               timeSpent:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Progress updated successfully
 */
router.put('/:materialId/progress', updateLearningProgress);

/**
 * @swagger
 * /learning-materials/{materialId}/progress:
 *   get:
 *     summary: Get learning progress for a material
 *     tags: [Learning Materials]
 *     parameters:
 *       - in: path
 *         name: materialId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Learning material ID
 *       - in: query
 *         name: userType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [CITIZEN, WORKER]
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Learning progress details
 */
router.get('/:materialId/progress', getMaterialProgress);

export default router;
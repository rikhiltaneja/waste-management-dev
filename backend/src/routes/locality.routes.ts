import express from 'express';
import { getLocalities, getCitizenLocality } from '../controllers/locality.controllers';

export const localityRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Locality
 *   description: Locality APIs
 */

/**
 * @swagger
 * /locality:
 *   get:
 *     summary: Get all localities with admin info
 *     tags: [Locality]
 *     responses:
 *       200:
 *         description: List of all localities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer }
 *                   name: { type: string }
 *                   admin: { type: object }
 *       404:
 *         description: No localities found
 *       500:
 *         description: Internal server error
 */
localityRouter.get('/', getLocalities);

/**
 * @swagger
 * /locality/citizen/{id}:
 *   get:
 *     summary: Get the locality of a given citizen
 *     tags: [Locality]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Citizen ID
 *     responses:
 *       200:
 *         description: Citizen locality retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 name: { type: string }
 *                 pincode: { type: string }
 *                 districtId: { type: integer }
 *       404:
 *         description: Citizen or locality not found
 *       500:
 *         description: Internal server error
 */
localityRouter.get('/citizen/:id', getCitizenLocality);
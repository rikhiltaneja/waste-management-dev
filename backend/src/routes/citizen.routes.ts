import express from "express";
import { allCitizens, entryController } from "../controllers/citizen.controllers";
import { clerkMiddleware, requireAuth } from "@clerk/express";

export const citizenRouter = express.Router();

citizenRouter.use(express.json());
citizenRouter.use(clerkMiddleware())

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Setup Route
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */

citizenRouter.get("/", entryController);
citizenRouter.get("/all",requireAuth() ,allCitizens);

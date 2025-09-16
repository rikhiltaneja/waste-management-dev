import express from "express";

export const userRouter = express.Router();

userRouter.use(express.json());

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
userRouter.get("/", (req, res)=>{
    res.send("Entry to the users route. Auth Pending!")
});

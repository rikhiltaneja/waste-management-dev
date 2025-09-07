import express from "express";

export const userRouter = express.Router();

userRouter.use(express.json());

userRouter.get("/", (req, res)=>{
    res.send("Entry to the users route. Auth Pending!")
});

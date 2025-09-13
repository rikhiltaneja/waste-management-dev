import express from "express";
import { allCitizens, entryController } from "../controllers/citizen.controllers";

export const citizenRouter = express.Router();

citizenRouter.use(express.json());

citizenRouter.get("/", entryController);

citizenRouter.get("/all", allCitizens)

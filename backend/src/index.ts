import dotenv from "dotenv";
import express from 'express';
import cors from 'cors'
import { citizenRouter } from './routes/citizen.routes';
import { districtAdminRouter } from "./routes/districtAdmin.routes";
import { localityAdminRouter } from "./routes/localityAdmin.routes";
import { workerRouter } from "./routes/worker.routes";
import complaintRouter from './routes/complaint.routes';
import physicalTrainingRouter from './routes/physicalTraining.routes';
import physicalTrainingRegistrationRouter from './routes/physicalTrainingRegistration.routes';
import attendanceRouter from './routes/attendance.routes';
import learningMaterialsRouter from './routes/learningMaterials.routes';
import complianceRouter from './routes/compliance.routes';
import userRegistrationsRouter from './routes/userRegistrations.routes';

import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './swagger';
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from './middlewares/errorHandler.middleware';
import { workersPredictionRouter } from "./routes/workersPrediction.routes";
import Razorpay from "razorpay";
import { donationRouter } from "./routes/donations.routes";


dotenv.config();
const app = express();
const PORT = 8080;


export const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
    res.send("Welcome to the server!");
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/uploads", express.static("uploads"));

app.use('/citizens', citizenRouter);
app.use('/workers', workerRouter);
app.use('/locality-admins', localityAdminRouter);
app.use('/district-admins', districtAdminRouter);
app.use('/complaints', complaintRouter);
app.use('/physical-training', physicalTrainingRouter);
app.use('/physical-training-registration', physicalTrainingRegistrationRouter);
app.use('/attendance', attendanceRouter);
app.use('/learning-materials', learningMaterialsRouter);
app.use('/compliance', complianceRouter);
app.use('/user-registrations', userRegistrationsRouter);

app.use('/workers-prediction', workersPredictionRouter)

app.use('/donations', donationRouter)

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
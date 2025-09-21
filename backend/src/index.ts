import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import { citizenRouter } from './routes/citizen.routes';
import physicalTrainingRouter from './routes/physicalTraining.routes';
import physicalTrainingRegistrationRouter from './routes/physicalTrainingRegistration.routes';
import userRegistrationsRouter from './routes/userRegistrations.routes';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './swagger';
import { clerkMiddleware } from '@clerk/express';
import cors from 'cors'
const app = express();
const PORT = 8080;
app.use(cors())

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(express.json());
app.use(clerkMiddleware())

app.get('/', (req, res) => {
    res.send("Welcome to the server!");
});

app.use('/citizens', citizenRouter);
app.use('/api/physical-training-events', physicalTrainingRouter);
app.use('/api/physical-training-events', physicalTrainingRegistrationRouter);
app.use('/api/users', userRegistrationsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
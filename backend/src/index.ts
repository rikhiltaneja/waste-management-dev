import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors'
import  {citizenRouter}  from './routes/citizen.routes';
import {districtAdminRouter} from "./routes/districtAdmin.routes";
import {localityAdminRouter} from "./routes/localityAdmin.routes";
import  {workerRouter}  from "./routes/worker.routes";
import complaintRouter  from './routes/complaint.routes';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './swagger';
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
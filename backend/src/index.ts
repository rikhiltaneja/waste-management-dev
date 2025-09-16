import express from 'express';
import { userRouter } from './routes/user.routes';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './swagger';

const app = express();
const PORT = 3000;

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Welcome to the server!");
});

app.use('/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
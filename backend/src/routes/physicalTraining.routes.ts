import { Router } from 'express';
import { getPhysicalTrainingEvents } from '../controllers/physicalTraining.controllers';

const router = Router();

router.get('/', getPhysicalTrainingEvents);

export default router;
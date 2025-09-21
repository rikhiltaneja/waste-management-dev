import { Router } from 'express';
import { 
  createLearningMaterial, 
  getLearningMaterials, 
  getLearningMaterialById, 
  updateLearningMaterial, 
  deleteLearningMaterial 
} from '../controllers/learningMaterials.controllers';
import { 
  startLearningMaterial, 
  updateLearningProgress, 
  getUserLearningProgress, 
  getMaterialProgress 
} from '../controllers/learningProgress.controllers';

const router = Router();

router.post('/', createLearningMaterial);
router.get('/', getLearningMaterials);
router.get('/:id', getLearningMaterialById);
router.put('/:id', updateLearningMaterial);
router.delete('/:id', deleteLearningMaterial);

router.post('/:materialId/start', startLearningMaterial);
router.put('/:materialId/progress', updateLearningProgress);
router.get('/:materialId/progress', getMaterialProgress);

export default router;
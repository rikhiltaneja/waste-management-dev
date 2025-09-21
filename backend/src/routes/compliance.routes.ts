import { Router } from 'express';
import { 
  getUserComplianceStatus, 
  getLocalityComplianceReport, 
  getDistrictComplianceReport 
} from '../controllers/complianceMonitoring.controllers';
import { 
  getTrainingAnalytics, 
  getComplianceAlerts, 
  sendComplianceReminders 
} from '../controllers/trainingAnalytics.controllers';
import { getUserLearningProgress } from '../controllers/learningProgress.controllers';

const router = Router();

router.get('/users/:userType/:userId', getUserComplianceStatus);
router.get('/users/:userType/:userId/progress', getUserLearningProgress);
router.get('/localities/:localityId', getLocalityComplianceReport);
router.get('/districts/:districtId', getDistrictComplianceReport);
router.get('/analytics', getTrainingAnalytics);
router.get('/alerts', getComplianceAlerts);
router.post('/reminders', sendComplianceReminders);

export default router;
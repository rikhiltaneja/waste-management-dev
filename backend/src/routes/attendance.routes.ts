import { Router } from 'express';
import { markAttendance, getEventAttendance, generateCertificate } from '../controllers/physicalTrainingAttendance.controllers';
import { getAttendanceStatistics, getMissedTrainingUsers, getLocalityAttendanceReport } from '../controllers/attendanceReporting.controllers';

const router = Router();

router.post('/events/:eventId/attendance', markAttendance);
router.get('/events/:eventId/attendance', getEventAttendance);
router.post('/events/:eventId/certificate', generateCertificate);
router.get('/events/:eventId/statistics', getAttendanceStatistics);
router.get('/events/:eventId/missed-users', getMissedTrainingUsers);
router.get('/localities/:localityId/attendance-report', getLocalityAttendanceReport);

export default router;
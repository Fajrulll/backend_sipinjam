import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboard';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getDashboardData);

export default router;

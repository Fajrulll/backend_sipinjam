import { Router } from 'express';
import { getLogs, createLog, clearLogs } from '../controllers/log';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Hanya admin yang bisa melihat semua log
router.get('/', requireRole(['Admin']), getLogs);
// Semua pengguna yang login bisa mencatat log
router.post('/', createLog);
// Hanya admin yang bisa menghapus log
router.delete('/', requireRole(['Admin']), clearLogs);

export default router;

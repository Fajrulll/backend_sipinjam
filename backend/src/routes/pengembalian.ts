import { Router } from 'express';
import { getPengembalian, createPengembalian, updateStatusPengembalian } from '../controllers/pengembalian';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getPengembalian);
router.post('/', createPengembalian);
router.put('/:id/status', requireRole(['Admin', 'Petugas']), updateStatusPengembalian);

export default router;

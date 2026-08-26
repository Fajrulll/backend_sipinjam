import { Router } from 'express';
import { getPeminjaman, getPeminjamanByUser, createPeminjaman, updateStatusPeminjaman } from '../controllers/peminjaman';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getPeminjaman);
router.get('/user/:userId', getPeminjamanByUser);
router.post('/', createPeminjaman);
router.put('/:id/status', requireRole(['Admin', 'Petugas']), updateStatusPeminjaman);

export default router;

import { Router } from 'express';
import { getAlat, createAlat, updateAlat, deleteAlat } from '../controllers/alat';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Semua rute alat membutuhkan login
router.use(authenticateToken);

// Hanya Admin yang bisa mengelola data master alat
router.get('/', getAlat);
router.post('/', requireRole(['Admin']), createAlat);
router.put('/:id', requireRole(['Admin']), updateAlat);
router.delete('/:id', requireRole(['Admin']), deleteAlat);

export default router;

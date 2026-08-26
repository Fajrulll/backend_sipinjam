import { Router } from 'express';
import { getKategori, createKategori, updateKategori, deleteKategori } from '../controllers/kategori';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Semua rute kategori membutuhkan login
router.use(authenticateToken);

// Hanya Admin yang bisa menambah, mengubah, atau menghapus kategori
router.get('/', getKategori);
router.post('/', requireRole(['Admin']), createKategori);
router.put('/:id', requireRole(['Admin']), updateKategori);
router.delete('/:id', requireRole(['Admin']), deleteKategori);

export default router;

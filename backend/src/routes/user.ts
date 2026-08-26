import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Semua rute user membutuhkan login dan role Admin
router.use(authenticateToken);
router.use(requireRole(['Admin']));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;

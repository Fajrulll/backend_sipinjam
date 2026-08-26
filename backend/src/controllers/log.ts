import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getLogs = async (req: Request, res: Response) => {
  try {
    const data = await prisma.log.findMany({
      include: {
        user: { select: { nama_lengkap: true, role: true, foto_profil: true } }
      },
      orderBy: { waktu: 'desc' },
      take: 100 // Batasi 100 log terakhir
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data log.' });
  }
};

export const createLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, aktivitas, role, modul, aksi, target, keterangan, status } = req.body;
    
    if (!user_id || (!aktivitas && !aksi)) {
      res.status(400).json({ message: 'User ID dan aktivitas/aksi wajib diisi.' });
      return;
    }

    const data = await prisma.log.create({
      data: {
        user_id: Number(user_id),
        aktivitas,
        role,
        modul,
        aksi,
        target,
        keterangan,
        status
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat log.' });
  }
};

export const clearLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.log.deleteMany({});
    res.json({ message: 'Semua log berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus log.' });
  }
};

import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { formatPeminjamanData } from './peminjaman';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const totalUser = await prisma.user.count();
    const totalAlat = await prisma.alat.count();
    
    const peminjamanAktif = await prisma.peminjaman.count({
      where: {
        status: {
          in: ['Menunggu', 'Dipinjam']
        }
      }
    });

    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    const pengembalianHariIni = await prisma.pengembalian.count({
      where: {
        tanggal_pengembalian: {
          gte: hariIni
        }
      }
    });

    const recentTransactions = await prisma.peminjaman.findMany({
      take: 5,
      orderBy: { tanggal_pinjam: 'desc' },
      include: {
        user: { select: { nama_lengkap: true } },
        detail_peminjaman: {
          include: { alat: { select: { nama_alat: true } } }
        }
      }
    });

    res.json({
      totalUser,
      totalAlat,
      peminjamanAktif,
      pengembalianHariIni,
      recentTransactions: formatPeminjamanData(recentTransactions)
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data dashboard.' });
  }
};

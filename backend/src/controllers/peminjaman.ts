import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getPeminjaman = async (req: Request, res: Response) => {
  try {
    const data = await prisma.peminjaman.findMany({
      include: {
        user: { select: { nama_lengkap: true, username: true, foto_profil: true } },
        detail_peminjaman: {
          include: {
            alat: { select: { nama_alat: true, foto: true } }
          }
        },
        pengembalian: true,
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data peminjaman.' });
  }
};

export const getPeminjamanByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = parseInt(req.params.userId as string, 10);
    const data = await prisma.peminjaman.findMany({
      where: { user_id },
      include: {
        user: { select: { nama_lengkap: true, username: true, foto_profil: true } },
        detail_peminjaman: {
          include: {
            alat: { select: { nama_alat: true, foto: true } }
          }
        },
        pengembalian: true,
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data peminjaman.' });
  }
};

export const createPeminjaman = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, tanggal_pinjam, tanggal_kembali, catatan, detail } = req.body;
    
    if (!user_id || !tanggal_pinjam || !tanggal_kembali || !detail || detail.length === 0) {
      res.status(400).json({ message: 'Data peminjaman tidak lengkap.' });
      return;
    }

    // Gunakan transaksi agar atomic
    const result = await prisma.$transaction(async (tx) => {
      const peminjaman = await tx.peminjaman.create({
        data: {
          user_id: Number(user_id),
          tanggal_pinjam: new Date(tanggal_pinjam),
          tanggal_kembali: new Date(tanggal_kembali),
          status: 'Menunggu',
          catatan,
        }
      });

      const detailData = detail.map((d: any) => ({
        peminjaman_id: peminjaman.id,
        alat_id: Number(d.alat_id),
        jumlah: Number(d.jumlah),
      }));

      await tx.detailPeminjaman.createMany({
        data: detailData
      });

      return peminjaman;
    });

    res.json({ message: 'Peminjaman berhasil diajukan.', id: result.id });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengajukan peminjaman.' });
  }
};

export const updateStatusPeminjaman = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { status } = req.body;
    
    if (!status) {
      res.status(400).json({ message: 'Status wajib diisi.' });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      const peminjaman = await tx.peminjaman.update({
        where: { id },
        data: { status }
      });

      // Jika disetujui, kurangi stok
      if (status === 'Dipinjam') {
        const details = await tx.detailPeminjaman.findMany({ where: { peminjaman_id: id } });
        for (const d of details) {
          await tx.alat.update({
            where: { id: d.alat_id },
            data: { stok: { decrement: d.jumlah } }
          });
        }
      }

      return peminjaman;
    });

    res.json({ message: 'Status peminjaman berhasil diperbarui.', data: result });
  } catch (err) {
    res.status(500).json({ message: 'Gagal update status peminjaman.' });
  }
};

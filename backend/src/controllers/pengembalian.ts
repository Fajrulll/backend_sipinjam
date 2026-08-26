import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getPengembalian = async (req: Request, res: Response) => {
  try {
    const data = await prisma.pengembalian.findMany({
      include: {
        peminjaman: {
          include: {
            user: { select: { nama_lengkap: true, username: true, foto_profil: true } }
          }
        },
        detail_pengembalian: {
          include: {
            alat: { select: { nama_alat: true, foto: true } }
          }
        }
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data pengembalian.' });
  }
};

export const createPengembalian = async (req: Request, res: Response): Promise<void> => {
  try {
    const { peminjaman_id, tanggal_pengembalian, catatan, detail } = req.body;
    
    if (!peminjaman_id || !tanggal_pengembalian || !detail || detail.length === 0) {
      res.status(400).json({ message: 'Data pengembalian tidak lengkap.' });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      const pengembalian = await tx.pengembalian.create({
        data: {
          peminjaman_id: Number(peminjaman_id),
          tanggal_pengembalian: new Date(tanggal_pengembalian),
          status: 'Menunggu',
          catatan,
        }
      });

      const detailData = detail.map((d: any) => ({
        pengembalian_id: pengembalian.id,
        alat_id: Number(d.alat_id),
        jumlah: Number(d.jumlah),
        kondisi: d.kondisi || 'Baik',
        catatan: d.catatan || '',
      }));

      await tx.detailPengembalian.createMany({
        data: detailData
      });

      // Update status peminjaman jadi 'Menunggu Pengembalian' atau semacamnya,
      // tetapi business rules SiPinjam bilang 'Selesai' saat disetujui petugas nanti.
      // Jadi biarkan saja.
      
      return pengembalian;
    });

    res.json({ message: 'Pengembalian berhasil diajukan.', id: result.id });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengajukan pengembalian.' });
  }
};

export const updateStatusPengembalian = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { status } = req.body;
    
    if (!status) {
      res.status(400).json({ message: 'Status wajib diisi.' });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      const pengembalian = await tx.pengembalian.update({
        where: { id },
        data: { status }
      });

      if (status === 'Diterima') {
        // Kembalikan stok alat
        const details = await tx.detailPengembalian.findMany({ where: { pengembalian_id: id } });
        for (const d of details) {
          await tx.alat.update({
            where: { id: d.alat_id },
            data: { stok: { increment: d.jumlah } }
          });
        }
        
        // Ubah status peminjaman jadi Selesai
        await tx.peminjaman.update({
          where: { id: pengembalian.peminjaman_id },
          data: { status: 'Selesai' }
        });
      }

      return pengembalian;
    });

    res.json({ message: 'Status pengembalian berhasil diperbarui.', data: result });
  } catch (err) {
    res.status(500).json({ message: 'Gagal update status pengembalian.' });
  }
};

import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getKategori = async (req: Request, res: Response) => {
  try {
    const data = await prisma.kategori.findMany();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data kategori.' });
  }
};

export const createKategori = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama_kategori, deskripsi, kode_kategori, warna } = req.body;
    if (!nama_kategori) {
      res.status(400).json({ message: 'Nama kategori wajib diisi.' });
      return;
    }
    const data = await prisma.kategori.create({
      data: { nama_kategori, deskripsi, kode_kategori, warna }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat data kategori.' });
  }
};

export const updateKategori = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { nama_kategori, deskripsi, kode_kategori, warna } = req.body;
    
    if (!nama_kategori) {
      res.status(400).json({ message: 'Nama kategori wajib diisi.' });
      return;
    }

    const data = await prisma.kategori.update({
      where: { id },
      data: { nama_kategori, deskripsi, kode_kategori, warna }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal update data kategori.' });
  }
};

export const deleteKategori = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    
    // Cek relasi
    const count = await prisma.alat.count({ where: { kategori_id: id } });
    if (count > 0) {
      res.status(400).json({ message: 'Kategori tidak dapat dihapus karena masih digunakan.' });
      return;
    }

    await prisma.kategori.delete({ where: { id } });
    res.json({ message: 'Kategori berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus data kategori.' });
  }
};

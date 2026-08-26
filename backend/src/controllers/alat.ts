import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { uploadSingle } from '../middleware/upload';
import path from 'path';
import fs from 'fs';

export const getAlat = async (req: Request, res: Response) => {
  try {
    const data = await prisma.alat.findMany({
      include: {
        kategori: true
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data alat.' });
  }
};

export const createAlat = async (req: Request, res: Response): Promise<void> => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    try {
      const { kategori_id, nama_alat, deskripsi, lokasi, stok, kondisi, catatan,
              kode_alat, nama_alat: namaAlatBody } = req.body;
      const namaFinal = nama_alat || namaAlatBody;
      
      if (!namaFinal || kategori_id == null) {
        res.status(400).json({ message: 'Nama alat dan kategori wajib diisi.' });
        return;
      }

      // URL foto jika ada file yang diupload
      let fotoUrl: string | undefined;
      if (req.file) {
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
        fotoUrl = `${baseUrl}/uploads/${req.file.filename}`;
      } else if (req.body.foto) {
        fotoUrl = req.body.foto;
      }

      const data = await prisma.alat.create({
        data: { 
          kategori_id: Number(kategori_id), 
          nama_alat: namaFinal, 
          deskripsi, 
          lokasi, 
          stok: Number(stok || 0), 
          kondisi, 
          foto: fotoUrl, 
          catatan 
        },
        include: { kategori: true }
      });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: 'Gagal membuat data alat.' });
    }
  });
};

export const updateAlat = async (req: Request, res: Response): Promise<void> => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    try {
      const id = parseInt(req.params.id as string, 10);
      const { kategori_id, nama_alat, deskripsi, lokasi, stok, kondisi, catatan } = req.body;
      
      if (!nama_alat || kategori_id == null) {
        res.status(400).json({ message: 'Nama alat dan kategori wajib diisi.' });
        return;
      }

      // Ambil data lama untuk hapus foto lama jika diganti
      const existingAlat = await prisma.alat.findUnique({ where: { id } });
      
      let fotoUrl: string | undefined | null = existingAlat?.foto;
      if (req.file) {
        // Ada file baru diupload, hapus foto lama jika ada di server lokal
        if (existingAlat?.foto && existingAlat.foto.includes('/uploads/')) {
          const oldFilename = existingAlat.foto.split('/uploads/')[1];
          const oldPath = path.join(__dirname, '../../uploads', oldFilename);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
        fotoUrl = `${baseUrl}/uploads/${req.file.filename}`;
      } else if (req.body.foto !== undefined) {
        fotoUrl = req.body.foto || null;
      }

      const data = await prisma.alat.update({
        where: { id },
        data: { 
          kategori_id: Number(kategori_id), 
          nama_alat, 
          deskripsi, 
          lokasi, 
          stok: Number(stok || 0), 
          kondisi, 
          foto: fotoUrl, 
          catatan 
        },
        include: { kategori: true }
      });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: 'Gagal update data alat.' });
    }
  });
};

export const deleteAlat = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await prisma.alat.delete({ where: { id } });
    res.json({ message: 'Alat berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus data alat.' });
  }
};

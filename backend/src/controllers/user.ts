import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prismaClient';
import { uploadSingle } from '../middleware/upload';
import path from 'path';
import fs from 'fs';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const data = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nama_lengkap: true,
        role: true,
        email: true,
        foto_profil: true,
        last_activity: true,
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data user.' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    try {
      const { username, nama_lengkap, role, email, password, foto_profil } = req.body;
      
      if (!username || !email || !password || !role) {
        res.status(400).json({ message: 'Username, email, role, dan password wajib diisi.' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let fotoUrl = foto_profil;
      if (req.file) {
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
        fotoUrl = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const data = await prisma.user.create({
        data: { 
          username, 
          nama_lengkap: nama_lengkap || username, 
          role, 
          email, 
          password: hashedPassword,
          foto_profil: fotoUrl 
        }
      });
      
      res.json({ message: 'User berhasil dibuat.', id: data.id });
    } catch (err) {
      res.status(500).json({ message: 'Gagal membuat user.' });
    }
  });
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    try {
      const id = parseInt(req.params.id as string, 10);
      const { username, nama_lengkap, role, email, password, foto_profil } = req.body;
      
      if (!username || !email || !role) {
        res.status(400).json({ message: 'Username, email, dan role wajib diisi.' });
        return;
      }

      const existingUser = await prisma.user.findUnique({ where: { id } });
      let fotoUrl = existingUser?.foto_profil;
      
      if (req.file) {
        if (existingUser?.foto_profil && existingUser.foto_profil.includes('/uploads/')) {
          const oldFilename = existingUser.foto_profil.split('/uploads/')[1];
          const oldPath = path.join(__dirname, '../../uploads', oldFilename);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
        fotoUrl = `${baseUrl}/uploads/${req.file.filename}`;
      } else if (foto_profil !== undefined) {
        fotoUrl = foto_profil || null;
      }

      let updateData: any = { username, nama_lengkap, role, email, foto_profil: fotoUrl };
      
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await prisma.user.update({
        where: { id },
        data: updateData
      });
      
      res.json({ message: 'User berhasil diupdate.' });
    } catch (err) {
      res.status(500).json({ message: 'Gagal update user.' });
    }
  });
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus user.' });
  }
};

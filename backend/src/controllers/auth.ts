import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_sipinjam_super_aman';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email dan password wajib diisi.' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: email }
        ]
      }
    });

    if (!user) {
      res.status(401).json({ message: 'Akun tidak terdaftar.' });
      return;
    }

    // Karena user SQLite sebelumnya menggunakan password plain text, kita cek dua-duanya
    // Saat produksi nanti, pastikan semua password di-hash.
    const isMatch = (password === user.password) || await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Password salah.' });
      return;
    }

    // Update last activity
    await prisma.user.update({
      where: { id: user.id },
      data: { last_activity: new Date() }
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login berhasil.',
      token,
      user: {
        id: user.id,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        role: user.role,
        email: user.email,
        foto_profil: user.foto_profil,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

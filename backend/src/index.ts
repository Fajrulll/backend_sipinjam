import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth';
import kategoriRoutes from './routes/kategori';
import alatRoutes from './routes/alat';
import userRoutes from './routes/user';
import peminjamanRoutes from './routes/peminjaman';
import pengembalianRoutes from './routes/pengembalian';
import logRoutes from './routes/log';
import dashboardRoutes from './routes/dashboard';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Pastikan folder uploads ada
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Serve static files (gambar upload)
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/alat', alatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/peminjaman', peminjamanRoutes);
app.use('/api/pengembalian', pengembalianRoutes);
app.use('/api/log', logRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('API SiPinjam berjalan...');
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server SiPinjam berjalan di http://0.0.0.0:${port}`);
});

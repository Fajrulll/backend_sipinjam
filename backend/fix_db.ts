import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const alatList = await prisma.alat.findMany();
  for (const alat of alatList) {
    let newUrl = alat.foto;
    if (newUrl) {
      if (newUrl.includes('localhost:3000') || newUrl.includes('127.0.0.1:3000') || newUrl.includes('10.0.2.2:3000')) {
        newUrl = newUrl.replace('localhost:3000', '192.168.0.192:3000').replace('127.0.0.1:3000', '192.168.0.192:3000').replace('10.0.2.2:3000', '192.168.0.192:3000');
      } else if (!newUrl.startsWith('http')) {
        newUrl = null;
      }
      
      if (newUrl !== alat.foto) {
        await prisma.alat.update({
          where: { id: alat.id },
          data: { foto: newUrl }
        });
        console.log(`Updated Alat ${alat.id}: ${alat.foto} -> ${newUrl}`);
      }
    }
  }

  const userList = await prisma.user.findMany();
  for (const user of userList) {
    let newUrl = user.foto_profil;
    if (newUrl) {
      if (newUrl.includes('localhost:3000') || newUrl.includes('127.0.0.1:3000') || newUrl.includes('10.0.2.2:3000')) {
        newUrl = newUrl.replace('localhost:3000', '192.168.0.192:3000').replace('127.0.0.1:3000', '192.168.0.192:3000').replace('10.0.2.2:3000', '192.168.0.192:3000');
      } else if (!newUrl.startsWith('http')) {
        newUrl = null;
      }
      
      if (newUrl !== user.foto_profil) {
        await prisma.user.update({
          where: { id: user.id },
          data: { foto_profil: newUrl }
        });
        console.log(`Updated User ${user.id}: ${user.foto_profil} -> ${newUrl}`);
      }
    }
  }

  console.log('Database image URLs updated!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `foto_profil` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `last_activity` DATETIME(3) NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategori` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kategori` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kategori_id` INTEGER NOT NULL,
    `nama_alat` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `lokasi` VARCHAR(191) NULL,
    `stok` INTEGER NOT NULL DEFAULT 0,
    `kondisi` VARCHAR(191) NULL,
    `foto` VARCHAR(191) NULL,
    `catatan` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `peminjaman` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `tanggal_pinjam` DATETIME(3) NOT NULL,
    `tanggal_kembali` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `catatan` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_peminjaman` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `peminjaman_id` INTEGER NOT NULL,
    `alat_id` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengembalian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `peminjaman_id` INTEGER NOT NULL,
    `tanggal_pengembalian` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `catatan` VARCHAR(191) NULL,

    UNIQUE INDEX `pengembalian_peminjaman_id_key`(`peminjaman_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_pengembalian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pengembalian_id` INTEGER NOT NULL,
    `alat_id` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `kondisi` VARCHAR(191) NOT NULL,
    `catatan` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `aktivitas` VARCHAR(191) NOT NULL,
    `waktu` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alat` ADD CONSTRAINT `alat_kategori_id_fkey` FOREIGN KEY (`kategori_id`) REFERENCES `kategori`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peminjaman` ADD CONSTRAINT `peminjaman_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_peminjaman` ADD CONSTRAINT `detail_peminjaman_peminjaman_id_fkey` FOREIGN KEY (`peminjaman_id`) REFERENCES `peminjaman`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_peminjaman` ADD CONSTRAINT `detail_peminjaman_alat_id_fkey` FOREIGN KEY (`alat_id`) REFERENCES `alat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengembalian` ADD CONSTRAINT `pengembalian_peminjaman_id_fkey` FOREIGN KEY (`peminjaman_id`) REFERENCES `peminjaman`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_pengembalian` ADD CONSTRAINT `detail_pengembalian_pengembalian_id_fkey` FOREIGN KEY (`pengembalian_id`) REFERENCES `pengembalian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_pengembalian` ADD CONSTRAINT `detail_pengembalian_alat_id_fkey` FOREIGN KEY (`alat_id`) REFERENCES `alat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log` ADD CONSTRAINT `log_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

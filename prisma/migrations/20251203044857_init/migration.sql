/*
  Warnings:

  - You are about to drop the `Petugas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Posko` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TblKorban` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Petugas" DROP CONSTRAINT "Petugas_poskoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TblKorban" DROP CONSTRAINT "TblKorban_poskoId_fkey";

-- DropTable
DROP TABLE "public"."Petugas";

-- DropTable
DROP TABLE "public"."Posko";

-- DropTable
DROP TABLE "public"."TblKorban";

-- DropEnum
DROP TYPE "public"."Role";

-- DropEnum
DROP TYPE "public"."StatusLaporan";

-- CreateTable
CREATE TABLE "tbl_barang" (
    "id_barang" SERIAL NOT NULL,
    "nm_barang" TEXT NOT NULL,

    CONSTRAINT "tbl_barang_pkey" PRIMARY KEY ("id_barang")
);

-- CreateTable
CREATE TABLE "tbl_desa" (
    "id_desa" SERIAL NOT NULL,
    "nm_desa" TEXT NOT NULL,
    "id_kecamatan" INTEGER NOT NULL,

    CONSTRAINT "tbl_desa_pkey" PRIMARY KEY ("id_desa")
);

-- CreateTable
CREATE TABLE "tbl_kecamatan" (
    "id_kecamatan" SERIAL NOT NULL,
    "nm_kecamatan" TEXT NOT NULL,

    CONSTRAINT "tbl_kecamatan_pkey" PRIMARY KEY ("id_kecamatan")
);

-- CreateTable
CREATE TABLE "tbl_posko" (
    "id_posko" SERIAL NOT NULL,
    "nm_posko" TEXT NOT NULL,
    "id_kecamatan" INTEGER NOT NULL,
    "id_desa" INTEGER NOT NULL,

    CONSTRAINT "tbl_posko_pkey" PRIMARY KEY ("id_posko")
);

-- CreateTable
CREATE TABLE "tbl_kejadian" (
    "id_kejadian" SERIAL NOT NULL,
    "nm_kejadian" TEXT NOT NULL,
    "jns_kejadian" TEXT NOT NULL,
    "skala" TEXT,
    "id_kecamatan" INTEGER NOT NULL,
    "id_desa" INTEGER NOT NULL,

    CONSTRAINT "tbl_kejadian_pkey" PRIMARY KEY ("id_kejadian")
);

-- CreateTable
CREATE TABLE "tbl_korban" (
    "id_korban" SERIAL NOT NULL,
    "nama_korban" TEXT NOT NULL,
    "jk" TEXT NOT NULL,
    "umur" INTEGER,
    "id_kejadian" INTEGER NOT NULL,
    "status" TEXT,

    CONSTRAINT "tbl_korban_pkey" PRIMARY KEY ("id_korban")
);

-- CreateTable
CREATE TABLE "tbl_penerimaan_bantuan" (
    "id_terima" SERIAL NOT NULL,
    "id_posko" INTEGER NOT NULL,
    "jns_bantuan" TEXT NOT NULL,
    "id_barang" INTEGER NOT NULL,
    "jumlah" INTEGER,
    "satuan" TEXT,
    "nm_pemberi" TEXT,

    CONSTRAINT "tbl_penerimaan_bantuan_pkey" PRIMARY KEY ("id_terima")
);

-- CreateTable
CREATE TABLE "tbl_pengeluaran_bantuan" (
    "id_keluar" SERIAL NOT NULL,
    "id_posko" INTEGER NOT NULL,
    "jns_bantuan" TEXT NOT NULL,
    "id_barang" INTEGER NOT NULL,
    "jumlah" INTEGER,
    "satuan" TEXT,
    "nm_penerima" TEXT,

    CONSTRAINT "tbl_pengeluaran_bantuan_pkey" PRIMARY KEY ("id_keluar")
);

-- CreateTable
CREATE TABLE "tbl_user" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "id_posko" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "tbl_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_username_key" ON "tbl_user"("username");

-- AddForeignKey
ALTER TABLE "tbl_desa" ADD CONSTRAINT "tbl_desa_id_kecamatan_fkey" FOREIGN KEY ("id_kecamatan") REFERENCES "tbl_kecamatan"("id_kecamatan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_posko" ADD CONSTRAINT "tbl_posko_id_kecamatan_fkey" FOREIGN KEY ("id_kecamatan") REFERENCES "tbl_kecamatan"("id_kecamatan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_posko" ADD CONSTRAINT "tbl_posko_id_desa_fkey" FOREIGN KEY ("id_desa") REFERENCES "tbl_desa"("id_desa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kejadian" ADD CONSTRAINT "tbl_kejadian_id_kecamatan_fkey" FOREIGN KEY ("id_kecamatan") REFERENCES "tbl_kecamatan"("id_kecamatan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kejadian" ADD CONSTRAINT "tbl_kejadian_id_desa_fkey" FOREIGN KEY ("id_desa") REFERENCES "tbl_desa"("id_desa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_korban" ADD CONSTRAINT "tbl_korban_id_kejadian_fkey" FOREIGN KEY ("id_kejadian") REFERENCES "tbl_kejadian"("id_kejadian") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_penerimaan_bantuan" ADD CONSTRAINT "tbl_penerimaan_bantuan_id_posko_fkey" FOREIGN KEY ("id_posko") REFERENCES "tbl_posko"("id_posko") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_penerimaan_bantuan" ADD CONSTRAINT "tbl_penerimaan_bantuan_id_barang_fkey" FOREIGN KEY ("id_barang") REFERENCES "tbl_barang"("id_barang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_pengeluaran_bantuan" ADD CONSTRAINT "tbl_pengeluaran_bantuan_id_posko_fkey" FOREIGN KEY ("id_posko") REFERENCES "tbl_posko"("id_posko") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_pengeluaran_bantuan" ADD CONSTRAINT "tbl_pengeluaran_bantuan_id_barang_fkey" FOREIGN KEY ("id_barang") REFERENCES "tbl_barang"("id_barang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_user" ADD CONSTRAINT "tbl_user_id_posko_fkey" FOREIGN KEY ("id_posko") REFERENCES "tbl_posko"("id_posko") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `tbl_korban` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tbl_korban" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "kk" TEXT,
ADD COLUMN     "nik" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "tbl_rumah" (
    "id_rumah_rusak" SERIAL NOT NULL,
    "nik" TEXT NOT NULL,
    "jenis_kerusakan" TEXT,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_rumah_pkey" PRIMARY KEY ("id_rumah_rusak")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_korban_nik_key" ON "tbl_korban"("nik");

-- AddForeignKey
ALTER TABLE "tbl_rumah" ADD CONSTRAINT "tbl_rumah_nik_fkey" FOREIGN KEY ("nik") REFERENCES "tbl_korban"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;

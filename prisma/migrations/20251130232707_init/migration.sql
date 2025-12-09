-- CreateEnum
CREATE TYPE "StatusLaporan" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PETUGAS');

-- CreateTable
CREATE TABLE "Posko" (
    "id" SERIAL NOT NULL,
    "namaposko" TEXT NOT NULL,
    "alamat" TEXT,

    CONSTRAINT "Posko_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Petugas" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "poskoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "Petugas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TblKorban" (
    "id" SERIAL NOT NULL,
    "poskoId" INTEGER NOT NULL,
    "totalPengungsi" INTEGER NOT NULL DEFAULT 0,
    "totalLuka" INTEGER NOT NULL DEFAULT 0,
    "totalHilang" INTEGER NOT NULL DEFAULT 0,
    "totalMeninggal" INTEGER NOT NULL DEFAULT 0,
    "totalSelamat" INTEGER NOT NULL DEFAULT 0,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" "StatusLaporan" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TblKorban_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Petugas_username_key" ON "Petugas"("username");

-- AddForeignKey
ALTER TABLE "Petugas" ADD CONSTRAINT "Petugas_poskoId_fkey" FOREIGN KEY ("poskoId") REFERENCES "Posko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TblKorban" ADD CONSTRAINT "TblKorban_poskoId_fkey" FOREIGN KEY ("poskoId") REFERENCES "Posko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

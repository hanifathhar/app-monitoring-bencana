/*
  Warnings:

  - Added the required column `tgl_kejadian` to the `tbl_kejadian` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbl_kejadian" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tgl_kejadian" TIMESTAMP(3) NOT NULL;

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const total = await prisma.tbl_korban.count();
  const luka = await prisma.tbl_korban.count({ where: { status: "Luka-luka" } });
  const meninggal = await prisma.tbl_korban.count({ where: { status: "Meninggal" } });
  const hilang = await prisma.tbl_korban.count({ where: { status: "Hilang" } });
  const mengungsi = await prisma.tbl_korban.count({ where: { status: "Mengungsi" } });
  const totalkejadian = await prisma.tbl_kejadian.count();
  const totalrumah = await prisma.tbl_rumah.count();

  return NextResponse.json({ total, luka, meninggal, hilang, mengungsi, totalkejadian, totalrumah });
}

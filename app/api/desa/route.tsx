import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id_kecamatan = Number(searchParams.get("id_kecamatan"));
  const data = await prisma.tbl_desa.findMany({
    where: id_kecamatan ? { id_kecamatan } : undefined,
  });
  return NextResponse.json(data);
}

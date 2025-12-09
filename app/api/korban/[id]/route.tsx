import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ DELETE
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const korbanId = Number(id);

  if (isNaN(korbanId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  await prisma.tbl_korban.delete({ where: { id_korban: korbanId } });
  return NextResponse.json({ message: "Berhasil dihapus" });
}

// ✅ UPDATE (PUT)
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const korbanId = Number(id);

  if (isNaN(korbanId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const body = await req.json();

  try {
    const updateKorban= await prisma.tbl_korban.update({
      where: { id_korban: korbanId },
      data: {
        nama_korban: body.nama_korban,
        jk: body.jk,
        umur: body.umur,
        id_kejadian: body.id_kejadian,
        status: body.status,
        alamat: body.alamat,
      },
    });

    return NextResponse.json(updateKorban);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal update data", details: String(error) },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ DELETE
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const poskoId = Number(id);

  if (isNaN(poskoId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  await prisma.tbl_posko.delete({ where: { id_posko: poskoId } });
  return NextResponse.json({ message: "Berhasil dihapus" });
}

// ✅ UPDATE (PUT)
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const poskoId = Number(id);

  if (isNaN(poskoId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const body = await req.json();

  try {
    const updatePosko = await prisma.tbl_posko.update({
      where: { id_posko: poskoId },
      data: {
        nm_posko: body.nm_posko,
        id_desa: body.id_desa,
        id_kecamatan: body.id_kecamatan,
      },
    });

    return NextResponse.json(updatePosko);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal update data", details: String(error) },
      { status: 500 }
    );
  }
}

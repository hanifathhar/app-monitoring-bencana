import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ DELETE
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const Idkejadian = Number(id);

  if (isNaN(Idkejadian)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  await prisma.tbl_kejadian.delete({ where: { id_kejadian: Idkejadian } });
  return NextResponse.json({ message: "Berhasil dihapus" });
}

// ✅ UPDATE (PUT)
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const Idkejadian = Number(id);

  if (isNaN(Idkejadian)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const body = await req.json();

  try {
    const updatePosko = await prisma.tbl_kejadian.update({
      where: { id_kejadian: Idkejadian },
      data: {
        nm_kejadian: body.nm_kejadian,
        jns_kejadian: body.jns_kejadian,
        skala: body.skala,
        id_desa: body.id_desa,
        id_kecamatan: body.id_kecamatan,
        tgl_kejadian: new Date(body.tgl_kejadian),
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

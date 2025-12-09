import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET detail rumah rusak berdasarkan ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const data = await prisma.tbl_rumah.findUnique({
      where: { id_rumah_rusak: Number(id) },
      include: {
        korban: {
          select: {
            nama_korban: true,
            nik: true,
            alamat: true,
          }
        }
      }
    });

    if (!data) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal mengambil data detail", details: error.message },
      { status: 500 }
    );
  }
}

// UPDATE rumah rusak
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { jenis_kerusakan, keterangan } = body;

    const updated = await prisma.tbl_rumah.update({
      where: { id_rumah_rusak: Number(id) },
      data: { jenis_kerusakan, keterangan }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal update data rumah rusak", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE rumah rusak
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.tbl_rumah.delete({
      where: { id_rumah_rusak: Number(id) },
    });

    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal menghapus data rumah rusak", details: error.message },
      { status: 500 }
    );
  }
}

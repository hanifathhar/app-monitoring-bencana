export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



export async function GET() {
  try {
    const surveys = await prisma.tbl_korban.findMany({
      include: {
        kejadian: {
          select: {
            nm_kejadian: true,
            desa: {
              select: { nm_desa: true },
            },
            kecamatan: {
              select: { nm_kecamatan: true },
            },
          },
        },
      },
      orderBy: { id_kejadian: "desc" },
    });

    return NextResponse.json(surveys);
  } catch (error: any) {
    console.error("❌ Error GET surveys:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data survey", details: error.message },
      { status: 500 }
    );
  }
}



export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nama_korban,
      jk,
      umur,
      id_kejadian,
      status,
      alamat,
      nik,
      kk,
    } = body;

    // 🔍 Validasi field wajib
    if (!nama_korban || !jk || !umur || !id_kejadian || !status) {
      return NextResponse.json(
        { error: "Field wajib tidak boleh kosong" },
        { status: 400 }
      );
    }

    // 🧩 Pastikan angka dikonversi dari string (jika dikirim dari form)

    // 📥 Simpan data ke database
    const survey = await prisma.tbl_korban.create({
      data: {
        nama_korban,
        jk,
        umur,
        id_kejadian,
        status,
        alamat,
        nik,
        kk,
      },
    });

    return NextResponse.json(
      { message: "Data Korban berhasil disimpan", survey },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error Prisma:", error);

  

    // 🧱 Error umum
    return NextResponse.json(
      {
        error: "Terjadi kesalahan pada server",
        details:
          process.env.NODE_ENV === "development"
            ? error.message || error.toString()
            : undefined,
      },
      { status: 500 }
    );
  }
}

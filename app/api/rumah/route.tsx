import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET semua data kerusakan rumah
export async function GET() {
  try {
    const data = await prisma.tbl_rumah.findMany({
      include: {
        korban: {
          select: {
            nama_korban: true,
            nik: true,
            alamat: true,

            // Ambil data kejadian
            kejadian: {
              select: {
                nm_kejadian: true,

                // Ambil data desa
                desa: {
                  select: {
                    nm_desa: true,

                    // ambil data kecamatan dari tabel desa
                    kecamatan: {
                      select: {
                        nm_kecamatan: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { id_rumah_rusak: "desc" }
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal mengambil data rumah rusak", details: error.message },
      { status: 500 }
    );
  }
}

// POST tambah data rumah rusak
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nik, jenis_kerusakan, keterangan } = body;

    if (!nik) {
      return NextResponse.json(
        { error: "NIK wajib diisi" },
        { status: 400 }
      );
    }

    // Buat data baru
    const newData = await prisma.tbl_rumah.create({
      data: {
        nik,
        jenis_kerusakan,
        keterangan,
      }
    });

    return NextResponse.json(newData, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal menambah data rumah rusak", details: error.message },
      { status: 500 }
    );
  }
}

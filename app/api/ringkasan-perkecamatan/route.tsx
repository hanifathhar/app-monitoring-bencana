import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Semua kecamatan
    const kecamatan = await prisma.tbl_kecamatan.findMany();

    // Semua kejadian (dengan id_kecamatan)
    const kejadian = await prisma.tbl_kejadian.findMany({
      include: {
        korban: true,
      },
    });

    // Semua rumah rusak
    const rumah = await prisma.tbl_rumah.findMany({
      include: {
        korban: true, // supaya tahu NIK korban
      },
    });

    // Proses rekap per kecamatan
    const result = kecamatan.map((kec) => {
      // Filter kejadian di kecamatan tersebut
      const kejadianKec = kejadian.filter(
        (k) => k.id_kecamatan === kec.id_kecamatan
      );

      // Semua korban dalam kecamatan itu
      const allKorban = kejadianKec.flatMap((k) => k.korban);

      // NIK korban dalam kecamatan
      const nikList = allKorban.map((k) => k.nik);

      // Rumah rusak berdasarkan nik korban
      const rumahKec = rumah.filter((r) => nikList.includes(r.nik));

      return {
        id_kecamatan: kec.id_kecamatan,
        nm_kecamatan: kec.nm_kecamatan,

        total_kejadian: kejadianKec.length,

        // Rekap korban
        total_korban: allKorban.length,
        total_meninggal: allKorban.filter((k) => k.status === "Meninggal").length,
        total_luka: allKorban.filter((k) => k.status === "Luka-luka").length,
        total_hilang: allKorban.filter((k) => k.status === "Hilang").length,
        total_mengungsi: allKorban.filter((k) => k.status === "Mengungsi").length,

        // ⚡ Rekap rumah rusak
        total_rumah_rusak: rumahKec.length,
        total_rusak_berat: rumahKec.filter((r) => r.jenis_kerusakan === "RusakBerat").length,
        total_rumah_hilang: rumahKec.filter((r) => r.jenis_kerusakan === "Hilang").length,
        total_rusak_ringan: rumahKec.filter((r) => r.jenis_kerusakan === "RusakRingan").length,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data ringkasan korban & rumah" },
      { status: 500 }
    );
  }
}

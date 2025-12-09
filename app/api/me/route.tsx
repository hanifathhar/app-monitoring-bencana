import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "rahasia-super-aman";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("token="));

    const rawToken = tokenMatch ? tokenMatch.split("=")[1] : "";

    if (!rawToken) {
      return NextResponse.json(
        { error: "Token tidak ditemukan" },
        { status: 401 }
      );
    }

    const cleanToken = decodeURIComponent(
      rawToken.replace(/^Bearer\s+/, "").trim()
    );

    const decoded = jwt.verify(cleanToken, JWT_SECRET) as {
      id: number;
      username: string;
    };

    // 🔥 Ambil user + posko + desa + kecamatan
    const user = await prisma.tbl_user.findUnique({
      where: { id: decoded.id },
      include: {
        posko: {
          include: {
            desa: true,
            kecamatan: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // 🔥 Format alamat posko (modern dan jelas)
    const posko_alamat = `Desa ${user.posko?.desa?.nm_desa}, Kecamatan ${user.posko?.kecamatan?.nm_kecamatan}`;

    return NextResponse.json({
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role,
        id_posko: user.id_posko,
        posko: user.posko?.nm_posko || "",
        posko_alamat, // 🔥 kirim alamat lengkap
      },
    });
  } catch (error: any) {
    console.error("❌ Error di /api/me:", error);

    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "Token telah kedaluwarsa" },
        { status: 401 }
      );
    }

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { error: "Token tidak valid" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

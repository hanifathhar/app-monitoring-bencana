export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "rahasia-super-aman";


export async function GET() {
  try {
    const surveys = await prisma.tbl_user.findMany({
      include: {
        posko: { select: { nm_posko: true } },
      },
      orderBy: { id: "desc" },
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
    const { nama, username, password, id_posko, role } = await req.json();

    // 🧩 Validasi input
    if (!nama || !username || !id_posko || !role) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // 🧩 Cek apakah user sudah ada (by email atau nip)
    const existingUser = await prisma.tbl_user.findFirst({
      where: { OR: [{ username }] },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username sudah terdaftar" },
        { status: 400 }
      );
    }

    // 🔒 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 Simpan ke database
    const newUser = await prisma.tbl_user.create({
      data: {
        nama,
        username,
        password: hashedPassword,
        id_posko,
        role,
      },
    });

    // 🎟️ Generate JWT
    const token = jwt.sign(
      {
        id: newUser.id,
        nama: newUser.nama,
        id_posko: newUser.id_posko,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🍪 Simpan token di cookie
    const response = NextResponse.json({
      message: "Registrasi berhasil",
      user: {
        id: newUser.id,
        nama: newUser.nama,
        username: newUser.username,
        id_posko: newUser.id_posko,
        role: newUser.role,
      },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 hari
    });

    return response;
  } catch (error) {
    console.error("❌ Error saat register:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

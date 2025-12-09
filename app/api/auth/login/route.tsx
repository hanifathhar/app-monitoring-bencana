export const runtime = "nodejs"; // ⬅️ pastikan baris ini paling atas!

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "rahasia-super-aman";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
    }

    const user = await prisma.tbl_user.findFirst({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: "Username tidak ditemukan" }, { status: 404 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user.id, nama: user.nama, username: user.username, id_posko: user.id_posko, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      message: "Login berhasil",
      user: { id: user.id, nama: user.nama, username: user.username, id_posko: user.id_posko, role: user.role },
      token, // Kirim token juga ke frontend sebagai backup
    });

    // ✅ Simpan token di cookie
    //response.cookies.set({
    //  name: "token",
   //   value: token,
    //  httpOnly: true,
   //   secure: false, // Set false untuk development
   //   sameSite: "lax",
   //   path: "/",
   //   maxAge: 60 * 60 * 24,
   // });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // penting!

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file dikirim" }, { status: 400 });
    }

    // ✅ Upload ke Blob Storage
    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN, // gunakan token env
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Gagal upload:", error);
    return NextResponse.json({ error: "Gagal upload foto" }, { status: 500 });
  }
}

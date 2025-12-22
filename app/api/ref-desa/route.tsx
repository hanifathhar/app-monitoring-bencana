import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "http://103.196.116.97:81/api/desa/list",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer dokdwri2i4mnhhfhjj4dadqo4i`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal fetch API eksternal");
    }

    const data = await response.json();

    // Return data mentah dari API eksternal
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dari server eksternal" },
      { status: 500 }
    );
  }
}

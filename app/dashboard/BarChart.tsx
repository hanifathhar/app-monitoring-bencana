"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function KorbanBarChart() {
  const [kecamatanList, setKecamatanList] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState<any>(null);
  const [korban, setKorban] = useState<any>(null);

  // 🔹 Ambil data kecamatan
  useEffect(() => {
    fetch("/api/kecamatan")
      .then((res) => res.json())
      .then((data) => setKecamatanList(data));
  }, []);

  // 🔹 Ambil data korban berdasarkan kecamatan
  useEffect(() => {
    if (!selectedKecamatan) return;

    fetch(`/api/korban/kecamatan/${selectedKecamatan}`)
      .then((res) => res.json())
      .then((data) => setKorban(data));
  }, [selectedKecamatan]);

  const filteredKecamatan = kecamatanList.filter((item: any) =>
    item.nm_kecamatan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">

      {/* 🔸 Dropdown + Search Kecamatan */}
      <div className="w-72">
        <input
          type="text"
          placeholder="Cari kecamatan..."
          className="w-full border rounded px-3 py-2 mb-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* LIST */}
        {search !== "" && (
          <div className="border rounded max-h-48 overflow-y-auto bg-white shadow absolute z-10 w-72">
            {filteredKecamatan.length === 0 ? (
              <p className="p-2 text-gray-500 text-sm">Tidak ditemukan</p>
            ) : (
              filteredKecamatan.map((item: any) => (
                <p
                  key={item.id_kecamatan}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedKecamatan(item.id_kecamatan);
                    setSearch(item.nm_kecamatan);
                  }}
                >
                  {item.nm_kecamatan}
                </p>
              ))
            )}
          </div>
        )}
      </div>

      {/* 🔸 Barchart */}
      <div className="w-full h-72">
        {!korban ? (
          <p className="text-gray-500">Pilih kecamatan untuk menampilkan data</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Luka", value: korban.luka, fill: "#facc15" },
                { name: "Meninggal", value: korban.meninggal, fill: "#dc2626" },
                { name: "Hilang", value: korban.hilang, fill: "#3b82f6" },
                { name: "Mengungsi", value: korban.mengungsi, fill: "#22c55e" },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />

              <Tooltip
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const d = payload[0];
                  return (
                    <div className="bg-white p-3 rounded-lg shadow border text-sm">
                      <p className="font-semibold">{d.payload.name}</p>
                      <p>Total: {d.value}</p>
                    </div>
                  );
                }}
              />

              <Bar dataKey="value">
                <Cell fill="#facc15" />
                <Cell fill="#dc2626" />
                <Cell fill="#3b82f6" />
                <Cell fill="#22c55e" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Home } from "lucide-react";

import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import * as XLSX from "xlsx";

interface User {
  id: number;
  nama: string;
  username: string;
  id_posko?: number;
  posko?: string;
  role: string;
}

interface RumahData {
  id_rumah_rusak: number;
  nik: string;
  jenis_kerusakan: string;
  keterangan: string;
  nama_korban: string;
  usia: number;
  jenis_kelamin: string;
  alamat: string;
  status_korban: string;
  nm_desa: string;
  nm_kecamatan: string;
  kk?: string;
}

export default function DataRumahPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [surveys, setSurveys] = useState<RumahData[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterQuery, setFilterQuery] = useState("");
  const [filterKecamatan, setFilterKecamatan] = useState("");
  const [filterDesa, setFilterDesa] = useState("");
  const [filterJenisKerusakan, setFilterJenisKerusakan] = useState("");
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaList, setDesaList] = useState<any[]>([]);

  const [rumah, setRumah] = useState({
    totalrumah: 0,
    rusakringan: 0,
    rusakberat: 0,
    rumahhilang: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    id: "",
    nik: "",
    nama_korban: "",
    kk: "",
    usia: "",
    jenis_kelamin: "",
    alamat: "",
    status_korban: "",
    jenis_kerusakan: "",
    keterangan: "",
    nm_kecamatan: "",
    nm_desa: "",
  });

  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          window.location.href = "/login";
          return;
        }
        const data = await res.json();
        setUser(data.user);

        if (data.user.role !== "PETUGAS" && data.user.role !== "ADMIN") {
          window.location.href = "/unauthorized";
        }
      } catch (e) {
        window.location.href = "/login";
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchKecamatan = async () => {
      const res = await fetch("/api/kecamatan");
      const data = await res.json();
      setKecamatanList(data);
    };
    fetchKecamatan();
  }, []);

  useEffect(() => {
    const fetchDesa = async () => {
      if (!filterKecamatan) {
        setDesaList([]);
        setFilterDesa("");
        return;
      }

      try {
        const res = await fetch("/api/desa");
        const allDesa = await res.json();
        
        const kecamatanObj = kecamatanList.find(k => k.nm_kecamatan === filterKecamatan);
        if (kecamatanObj) {
          const filteredDesa = allDesa.filter(
            (d: any) => d.id_kecamatan === kecamatanObj.id_kecamatan
          );
          setDesaList(filteredDesa);
        }
      } catch (err) {
        console.error("Error fetching desa:", err);
        toast({ title: "Gagal memuat daftar desa" });
      }
    };

    fetchDesa();
  }, [filterKecamatan, kecamatanList]);

  const fetchRumahRekap = async () => {
  try {
    const res = await fetch("/api/rekap-kecamatan");
    if (!res.ok) throw new Error("Gagal memuat data rekap rumah");

    const data = await res.json();

    const totalRumahRusak = data.reduce(
      (sum: number, item: any) =>
        sum + Number(item.total_rumah_rusak || 0),
      0
    );

    const totalRusakRingan = data.reduce(
      (sum: number, item: any) =>
        sum + Number(item.total_rusak_ringan || 0),
      0
    );

    const totalRusakBerat = data.reduce(
      (sum: number, item: any) =>
        sum + Number(item.total_rusak_berat || 0),
      0
    );

    const totalRumahHilang = data.reduce(
      (sum: number, item: any) =>
        sum + Number(item.total_rumah_hilang || 0),
      0
    );

    setRumah({
      totalrumah: totalRumahRusak,
      rusakringan: totalRusakRingan,
      rusakberat: totalRusakBerat,
      rumahhilang: totalRumahHilang,
    });
  } catch (err) {
    console.error("Error fetching rekap rumah:", err);
    toast({
      title: "⚠️ Gagal memuat data rekap rumah",
    });
  }
};


  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data-rumah");
      if (!res.ok) throw new Error("Gagal memuat data rumah");
      const json = await res.json();
      setSurveys(json);
    } catch (err) {
      console.error(err);
      toast({ title: "❌ Gagal memuat data rumah" });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSurveys();
    fetchRumahRekap();

    const interval = setInterval(() => {
      fetchRumahRekap();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredSurveys = surveys.filter((s) => {
    const q = filterQuery.toLowerCase();

    const nm = s.nama_korban?.toLowerCase() || "";
    const jk = s.jenis_kelamin?.toLowerCase() || "";
    const jenisKerusakan = s.jenis_kerusakan?.toLowerCase() || "";
    const alamat = s.alamat?.toLowerCase() || "";
    const nik = s.nik?.toLowerCase() || "";

    const kecamatan = s.nm_kecamatan || "";
    const desa = s.nm_desa || "";

    const matchText =
      !filterQuery ||
      nm.includes(q) ||
      jk.includes(q) ||
      jenisKerusakan.includes(q) ||
      alamat.includes(q) ||
      nik.includes(q);

    const matchJenisKerusakan =
      !filterJenisKerusakan || s.jenis_kerusakan === filterJenisKerusakan;

    const matchKecamatan =
      !filterKecamatan || kecamatan === filterKecamatan;

    const matchDesa =
      !filterDesa || desa === filterDesa;

    return matchText && matchJenisKerusakan && matchKecamatan && matchDesa;
  });

  const totalPages = Math.max(1, Math.ceil(filteredSurveys.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSurveys = filteredSurveys.slice(startIndex, startIndex + itemsPerPage);

  const exportExcel = () => {
    const data = filteredSurveys.map((s, index) => ({
      No: index + 1,
      NIK: s.nik,
      Nama: s.nama_korban,
      "Jenis Kelamin": s.jenis_kelamin,
      Umur: s.usia,
      "Jenis Kerusakan": s.jenis_kerusakan,
      Keterangan: s.keterangan || "-",
      Alamat: s.alamat || "-",
      Desa: s.nm_desa,
      Kecamatan: s.nm_kecamatan,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Rumah");
    XLSX.writeFile(wb, `data_rumah_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Memuat...
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        active="datarumah"
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
        />

        <main className="p-6 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">🏠 Data Rumah Rusak</h2>

            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                onClick={exportExcel}
                className="bg-green-50 hover:bg-green-100 text-green-700"
              >
                📊 Export Excel
              </Button>
            </div>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div
              className="bg-white p-5 rounded-xl shadow flex items-center gap-4"
              style={{ animation: "blink 2.2s infinite" }}
            >
              <div className="bg-blue-100 p-3 rounded-full">
                <Home className="text-blue-600" size={26} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Rumah Terdampak</p>
                <h3 className="text-3xl font-bold text-blue-600 mt-1">{rumah.totalrumah}</h3>
                <p className="text-xs text-gray-400">Realtime update...</p>
              </div>
            </div>

            <RumahCard icon={<Home size={26} />} title="Rusak Ringan" value={rumah.rusakringan} color="green" />
            <RumahCard icon={<Home size={26} />} title="Rusak Berat" value={rumah.rusakberat} color="red" />
            <RumahCard icon={<Home size={26} />} title="Hilang/Hanyut" value={rumah.rumahhilang} color="yellow" />
          </section>

          <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg shadow items-center">
            <Input
              placeholder="Cari nama / NIK / jenis kerusakan / alamat..."
              value={filterQuery}
              onChange={(e) => {
                setFilterQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-lg"
            />

            <select
              value={filterJenisKerusakan}
              onChange={(e) => {
                setFilterJenisKerusakan(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 p-2 rounded text-sm"
            >
              <option value="">Semua Jenis Kerusakan</option>
              <option value="Rusak Ringan">Rusak Ringan</option>
              <option value="Rusak Berat">Rusak Berat</option>
              <option value="Hilang/Hanyut">Hilang/Hanyut</option>
            </select>

            <select
              value={filterKecamatan}
              onChange={(e) => {
                const v = e.target.value;
                setFilterKecamatan(v);
                setFilterDesa("");
                setCurrentPage(1);
              }}
              className="border border-gray-300 p-2 rounded text-sm"
            >
              <option value="">Semua Kecamatan</option>
              {kecamatanList.map((k) => (
                <option key={k.nm_kecamatan} value={k.nm_kecamatan}>
                  {k.nm_kecamatan}
                </option>
              ))}
            </select>

            <select
              value={filterDesa}
              onChange={(e) => {
                setFilterDesa(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 p-2 rounded text-sm"
              disabled={!filterKecamatan}
            >
              <option value="">Semua Desa</option>
              {desaList.map((d) => (
                <option key={d.id_desa} value={d.nm_desa}>
                  {d.nm_desa}
                </option>
              ))}
            </select>

            <Button
              variant="secondary"
              onClick={() => {
                setFilterQuery("");
                setFilterKecamatan("");
                setFilterDesa("");
                setFilterJenisKerusakan("");
                setCurrentPage(1);
              }}
            >
              Reset
            </Button>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            {loading ? <p>Loading...</p> : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>NIK</TableHead>
                        <TableHead>KK</TableHead>
                        <TableHead>Jenis Kerusakan</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Desa</TableHead>
                        <TableHead>Kecamatan</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {paginatedSurveys.map((s, index) => (
                        <TableRow key={s.id_rumah_rusak}>
                        <TableCell>{startIndex + index + 1}</TableCell>
                        <TableCell>{s.nama_korban}</TableCell>
                        <TableCell>{s.nik}</TableCell>
                        <TableCell>{s.kk}</TableCell>
                        <TableCell>{s.jenis_kerusakan}</TableCell>
                        <TableCell>{s.alamat}</TableCell>
                        <TableCell>{s.nm_desa}</TableCell>
                        <TableCell>{s.nm_kecamatan}</TableCell>

                        <TableCell className="flex gap-2">
                            <Button
                            size="sm"
                            onClick={() => {
                                setForm({
                                id: String(s.id_rumah_rusak),
                                nama_korban: s.nama_korban,
                                nik: s.nik,
                                kk: s.kk || "",
                                usia: String(s.usia),
                                jenis_kelamin: s.jenis_kelamin,
                                alamat: s.alamat,
                                status_korban: s.status_korban,
                                jenis_kerusakan: s.jenis_kerusakan,
                                keterangan: s.keterangan || "",
                                nm_kecamatan: s.nm_kecamatan,
                                nm_desa: s.nm_desa,
                                });
                                setOpenEdit(true);
                            }}
                            >
                            Detail
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>

                {filteredSurveys.length === 0 && (
                  <p className="text-center text-gray-500 mt-4">Tidak ada data.</p>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-500">Menampilkan {filteredSurveys.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredSurveys.length)} dari {filteredSurveys.length} data</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>‹ Sebelumnya</Button>
                      <span className="text-sm text-gray-700">Halaman {currentPage} dari {totalPages}</span>
                      <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Selanjutnya ›</Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent className="sm:max-w-screen-lg w-full rounded-xl shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="border-b px-6 py-4 bg-gray-50">
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Detail Data Rumah Rusak
                    </DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="max-h-[75vh] px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Card className="col-span-full p-4 border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-gray-700 mb-3">
                            🏠 Informasi Rumah & Pemilik
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <InputField
                            label="Nama Korban"
                            value={form.nama_korban}
                            readOnly
                            />

                            <InputField
                            label="NIK"
                            value={form.nik}
                            readOnly
                            />

                            <InputField
                            label="Nomor KK"
                            value={form.kk}
                            readOnly
                            />

                           

                            <InputField
                            label="Jenis Kerusakan"
                            value={form.jenis_kerusakan}
                            readOnly
                            />

                            <InputField
                            label="Desa"
                            value={form.nm_desa}
                            readOnly
                            />

                            <InputField
                            label="Kecamatan"
                            value={form.nm_kecamatan}
                            readOnly
                            />

                            <div className="col-span-full">
                            <InputField
                                label="Keterangan"
                                type="textarea"
                                value={form.keterangan}
                                readOnly
                            />
                            </div>

                            <div className="col-span-full">
                            <InputField
                                label="Alamat"
                                type="textarea"
                                value={form.alamat}
                                readOnly
                            />
                            </div>

                        </div>
                        </Card>

                        <Separator className="col-span-full" />

                        <div className="col-span-full flex justify-end pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setOpenEdit(false)}
                        >
                            Tutup
                        </Button>
                        </div>

                    </div>
                    </ScrollArea>
                </DialogContent>
                </Dialog>

        </main>
      </div>
    </div>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: string;
  readOnly?: boolean;
};

function InputField({ label, type = "text", value, onChange, readOnly }: InputFieldProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>

      {type === "textarea" ? (
          <textarea
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            className="border rounded-md p-2 bg-gray-100"
          />
        ) : (
          <input
            type={type || "text"}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            className="border rounded-md p-2 bg-gray-100"
          />
        )}
    </div>
  );
}

function RumahCard({
  icon,
  title,
  value,
  color,
}: {
  icon: any;
  title: string;
  value: number;
  color: string;
}) {
  const colors: any = {
    green: "text-green-600 bg-green-100",
    yellow: "text-yellow-600 bg-yellow-100",
    red: "text-red-600 bg-red-100",
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
      <div className={`${colors[color]} p-3 rounded-full`}>{icon}</div>

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className={`text-3xl font-bold ${colors[color].split(" ")[0]} mt-1`}>
          {value}
        </h3>
      </div>
    </div>
  );
}

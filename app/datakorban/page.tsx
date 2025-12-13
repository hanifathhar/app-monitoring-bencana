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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Activity,
  HeartPulse,
  AlertTriangle,
  Tent,
  Package,
  Home,
} from "lucide-react";

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


interface Kecamatan {
  id_kecamatan: number;
  nm_kecamatan: string;
}

interface Desa {
  id_desa: number;
  nm_desa: string;
  id_kecamatan: number;
}

interface Kejadian {
  id_kejadian: number;
  nm_kejadian: string;
}

interface DataKecamatan {
  kecamatan: string;
  total: number;
  luka: number;
  meninggal: number;
  hilang: number;
  mengungsi: number;
  totalkejadian: number;

  rumahrusak: number;
  rusakringan: number;
  rumahhilang: number;
  rusakberat: number;
}


interface Survey {
  id: number;
  nomor_kk: string;
  nik: string;
  nama: string;
  usia: number;
  jenis_kelamin: string;
  hubungan_keluarga: string;
  alamat: string;
  status_korban: string;
  status_rumah: string;
  kondisi_rumah: string;
  jenis_bangunan: string;
  nm_desa: string;
  nm_kecamatan: string;
}


export default function SurveyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Filter
  const [filterQuery, setFilterQuery] = useState("");
  const [kejadianList, setKejadianList] = useState<{ id_kejadian: number; nm_kejadian: string }[]>([]);

  const [filterKecamatan, setFilterKecamatan] = useState("");
  const [filterDesa, setFilterDesa] = useState("");
  const [filterStatusKorban, setFilterStatusKorban] = useState("");
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaList, setDesaList] = useState<any[]>([]);

  const [korban, setKorban] = useState({
      total: 0,
      luka: 0,
      meninggal: 0,
      hilang: 0,
      mengungsi: 0,
      totalkejadian: 0,
    });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state (strings for inputs)
  const [form, setForm] = useState({
    id: "",
    nama: "",
    nik: "",
    nomor_kk: "",
    usia: "",
    jenis_kelamin: "",
    hubungan_keluarga: "",
    alamat: "",
    status_korban: "",
    status_rumah: "",
    kondisi_rumah: "",
    jenis_bangunan: "",
    nm_kecamatan: "",
    nm_desa: "",
    });

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const resetForm = () => {
  setForm({
    id: "",
    nama: "",
    nik: "",
    nomor_kk: "",
    usia: "",
    jenis_kelamin: "",
    hubungan_keluarga: "",
    alamat: "",
    status_korban: "",
    status_rumah: "",
    kondisi_rumah: "",
    jenis_bangunan: "",
    nm_kecamatan: "",
    nm_desa: "",
  });
};

  // Cek user login & role
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

        // Restrict access if role bukan PETUGAS/ADMIN
        if (data.user.role !== "PETUGAS" && data.user.role !== "ADMIN") {
          window.location.href = "/unauthorized";
        }
      } catch (e) {
        window.location.href = "/login";
      }
    };
    fetchUser();
  }, []);


  // Ambil Kejahdian
  useEffect(() => {
    const fetchKejadian = async () => {
        try {
        const res = await fetch("/api/kejadian");
        const data = await res.json();
        setKejadianList(data);
        } catch {
        toast({ title: "Gagal memuat daftar kejadian" });
        }
    };
    fetchKejadian();
    }, []);


  useEffect(() => {
  const fetchKecamatan = async () => {
    const res = await fetch("/api/kecamatan");
    const data = await res.json();
    setKecamatanList(data);
  };

  fetchKecamatan();
  }, []);

  // Fetch desa ketika kecamatan berubah
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
        
        // Filter desa berdasarkan kecamatan yang dipilih
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


  const fetchKorban = async () => {
    try {
      const res = await fetch("/api/rekap");
      if (!res.ok) throw new Error("Gagal memuat data rekap");
      
      const data = await res.json();
      console.log("Data rekap dari API:", data); // Debug log

      setKorban({
        total: data.total || 0,
        luka: data.luka || 0,
        meninggal: data.meninggal || 0,
        hilang: data.hilang || 0,
        mengungsi: data.mengungsi || 0,
        totalkejadian: data.totalkejadian || 0,
      });
    } catch (err) {
      console.error("Error fetching rekap:", err);
      toast({ 
        title: "⚠️ Gagal memuat data rekap korban",
      });
    }
  };


  // Ambil survey
  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data-korban");
      if (!res.ok) throw new Error("Gagal memuat data survey");
      const json = await res.json();
      setSurveys(json);
    } catch (err) {
      console.error(err);
      toast({ title: "❌ Gagal memuat data survey" });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSurveys();
    fetchKorban();

    // Polling untuk update realtime setiap 10 detik
    const interval = setInterval(() => {
      fetchKorban();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Validasi sederhana
  const validateForm = () => {
    if (!form.nama?.trim()) {
      toast({ title: "⚠️ Nama korban wajib diisi" });
      return false;
    }
    if (!form.jenis_kelamin?.trim()) {
      toast({ title: "⚠️ Jenis kelamin wajib diisi" });
      return false;
    }
    if (!form.usia?.trim() || Number.isNaN(Number(form.usia))) {
      toast({ title: "⚠️ Umur wajib diisi dengan angka" });
      return false;
    }
    if (!form.status_korban?.trim()) {
      toast({ title: "⚠️ Status wajib diisi" });
      return false;
    }
    return true;
  };

  // Submit (Tambah)
  
  
  // Filtered & Pagination
  const filteredSurveys = surveys.filter((s) => {
    const q = filterQuery.toLowerCase();

    const nm = s.nama?.toLowerCase() || "";
    const jk = s.jenis_kelamin?.toLowerCase() || "";
    const status = s.status_korban?.toLowerCase() || "";
    const alamat = s.alamat?.toLowerCase() || "";

    const kecamatan = s.nm_kecamatan || "";
    const desa = s.nm_desa || "";

    const matchText =
      !filterQuery ||
      nm.includes(q) ||
      jk.includes(q) ||
      status.includes(q) ||
      alamat.includes(q);

    const matchStatus =
      !filterStatusKorban || s.status_korban === filterStatusKorban;

    const matchKecamatan =
      !filterKecamatan || kecamatan === filterKecamatan;

    const matchDesa =
      !filterDesa || desa === filterDesa;

    return matchText && matchStatus && matchKecamatan && matchDesa;
  });

  const totalPages = Math.max(1, Math.ceil(filteredSurveys.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSurveys = filteredSurveys.slice(startIndex, startIndex + itemsPerPage);

  // Export Excel
  const exportExcel = () => {
    const data = filteredSurveys.map((s) => ({
      ID: s.id,
      Nama: s.nama,
      JK: s.jenis_kelamin,
      Umur: s.usia,
      Status: s.status_korban,
      Alamat: s.alamat || "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Korban");
    XLSX.writeFile(wb, `korban_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Export PDF
  
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
        active="datakorban"
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
            <h2 className="text-xl font-bold">📋 Data Korban</h2>

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

           {/* CARD KORBAN */}
          <section className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {/* TOTAL KORBAN - REALTIME */}
            <div
              className="bg-white p-5 rounded-xl shadow flex items-center gap-4"
              style={{ animation: "blink 2.2s infinite" }}
            >
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="text-blue-600" size={26} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Korban</p>
                <h3 className="text-3xl font-bold text-blue-600 mt-1">{korban.total}</h3>
                <p className="text-xs text-gray-400">Realtime update...</p>
              </div>
            </div>

            {/* Lainnya */}
            <KorbanCard icon={<Activity size={26} />} title="Luka" value={korban.luka} color="yellow" />
            <KorbanCard icon={<HeartPulse size={26} />} title="Meninggal" value={korban.meninggal} color="red" />
            <KorbanCard icon={<AlertTriangle size={26} />} title="Hilang" value={korban.hilang} color="blue" />
            <KorbanCard icon={<Tent size={26} />} title="Mengungsi" value={korban.mengungsi} color="green" />
          </section>

          {/* Filter */}
          <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg shadow items-center">
            {/* Filter search */}
            <Input
              placeholder="Cari nama / jk / status / alamat..."
              value={filterQuery}
              onChange={(e) => {
                setFilterQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-lg"
            />

            {/* Filter Status */}
            <select
              value={filterStatusKorban}
              onChange={(e) => {
                setFilterStatusKorban(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 p-2 rounded text-sm"
            >
              <option value="">Semua Status</option>
              <option value="Meninggal">Meninggal</option>
              <option value="Luka-luka">Luka-luka</option>
              <option value="Hilang">Hilang</option>
              <option value="Selamat">Mengungsi</option>
            </select>

            {/* Filter Kecamatan */}
            <select
              value={filterKecamatan}
              onChange={(e) => {
                const v = e.target.value;
                setFilterKecamatan(v);
                setFilterDesa(""); // Reset desa ketika kecamatan berubah
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

            {/* Filter Desa */}
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
                setFilterStatusKorban("");
                setCurrentPage(1);
              }}
            >
              Reset
            </Button>
          </div>

          {/* Table */}
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
                        <TableHead>Usia</TableHead>
                        <TableHead>JK</TableHead>
                        <TableHead>Status Korban</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Desa</TableHead>
                        <TableHead>Kecamatan</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {paginatedSurveys.map((s, index) => (
                        <TableRow key={s.id}>
                        <TableCell>{startIndex + index + 1}</TableCell>
                        <TableCell>{s.nama}</TableCell>
                        <TableCell>{s.nik}</TableCell>
                        <TableCell>{s.nomor_kk}</TableCell>
                        <TableCell>{s.usia}</TableCell>
                        <TableCell>{s.jenis_kelamin}</TableCell>
                        <TableCell>{s.status_korban}</TableCell>
                        <TableCell>{s.alamat}</TableCell>
                        <TableCell>{s.nm_desa}</TableCell>
                        <TableCell>{s.nm_kecamatan}</TableCell>

                        <TableCell className="flex gap-2">
                            <Button
                            size="sm"
                            onClick={() => {
                                setForm({
                                id: String(s.id),
                                nama: s.nama,
                                nik: s.nik,
                                nomor_kk: s.nomor_kk,
                                usia: String(s.usia),
                                jenis_kelamin: s.jenis_kelamin,
                                hubungan_keluarga: s.hubungan_keluarga,
                                alamat: s.alamat,
                                status_korban: s.status_korban,
                                status_rumah: s.status_rumah,
                                kondisi_rumah: s.kondisi_rumah,
                                jenis_bangunan: s.jenis_bangunan,
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

          {/* EDIT DIALOG */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent className="sm:max-w-screen-lg w-full rounded-xl shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="border-b px-6 py-4 bg-gray-50">
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Detail Data Korban
                    </DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="max-h-[75vh] px-6 py-4">
                    {/* ❌ TIDAK PAKAI FORM */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Card className="col-span-full p-4 border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-gray-700 mb-3">
                            📝 Informasi Korban
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Nama */}
                            <InputField
                            label="Nama Korban"
                            value={form.nama}
                            readOnly
                            />

                            {/* NIK */}
                            <InputField
                            label="NIK"
                            value={form.nik}
                            readOnly
                            />

                            {/* Nomor KK */}
                            <InputField
                            label="Nomor KK"
                            value={form.nomor_kk}
                            readOnly
                            />

                            {/* Usia */}
                            <InputField
                            label="Usia"
                            value={form.usia}
                            readOnly
                            />

                            <InputField
                            label="Jenis Kelamin"
                            value={form.jenis_kelamin}
                            readOnly
                            />

                            {/* Usia */}
                            <InputField
                            label="Status Korban"
                            value={form.status_korban}
                            readOnly
                            />

                            {/* Usia */}
                            <InputField
                            label="Desa"
                            value={form.nm_desa}
                            readOnly
                            />

                            {/* Usia */}
                            <InputField
                            label="Kecamatan"
                            value={form.nm_kecamatan}
                            readOnly
                            />

                            {/* Alamat */}
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

                        {/* Tombol hanya Tutup */}
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

/* Reusable InputField component — typed */
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

function KorbanCard({
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
    yellow: "text-yellow-600 bg-yellow-100",
    red: "text-red-600 bg-red-100",
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
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



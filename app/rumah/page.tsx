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
import Select from "react-select";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

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


interface Survey {
  id_rumah_rusak: number;
  nik: string;
  jenis_kerusakan: string;
  keterangan: string;
  korban?: {
    nama_korban: string;
    alamat: string;
    kejadian?: { 
        nm_kejadian: string;
        desa?: { nm_desa: string;
                 kecamatan?: { nm_kecamatan: string; } 
               }
    } | null;
  } | null;
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
  const [filterStatusKorban, setFilterStatusKorban] = useState("");
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [korbanList, setKorbanList] = useState<any[]>([]);
  const [selectedKorban, setSelectedKorban] = useState<any>(null);
  const [korbanOptions, setKorbanOptions] = useState<any[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state (strings for inputs)
  const [form, setForm] = useState({
    id_rumah_rusak: "",
    nik: "",
    jenis_kerusakan: "",
    keterangan: "",
  });

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const resetForm = () => {
    setForm({
       id_rumah_rusak: "",
       nik: "",
       jenis_kerusakan: "",
       keterangan: "",
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
        const res = await fetch("/api/rumah");
        const data = await res.json();
        setKejadianList(data);
        } catch {
        toast({ title: "Gagal memuat daftar kejadian" });
        }
    };
    fetchKejadian();
    }, []);


    useEffect(() => {
  async function fetchKorban() {
    const res = await fetch("/api/korban");
    const data = await res.json();

    const options = data.map((k: any) => ({
      value: k.nik,
      label: k.nama_korban,
    }));

    setKorbanOptions(options);
  }

  fetchKorban();
}, []);


  useEffect(() => {
  const fetchKecamatan = async () => {
    const res = await fetch("/api/kecamatan");
    const data = await res.json();
    setKecamatanList(data);
  };

  fetchKecamatan();
  }, []);


  // Ambil survey
  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rumah");
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
  }, []);

  // Validasi sederhana
  const validateForm = () => {
    if (!form.nik?.trim()) {
      toast({ title: "⚠️ Nama korban wajib diisi" });
      return false;
    }
    if (!form.jenis_kerusakan?.trim()) {
      toast({ title: "⚠️ Jenis kelamin wajib diisi" });
      return false;
    }
    return true;
  };

  // Submit (Tambah)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      const body = {
        nik: form.nik,
        jenis_kerusakan: form.jenis_kerusakan,
        keterangan: form.keterangan,
      };

      const res = await fetch("/api/rumah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal menambah data korban");

      toast({ title: "✅ Korban berhasil ditambahkan" });
      setOpenAdd(false);
      resetForm();
      fetchSurveys();
    } catch (err: any) {
      console.error(err);
      toast({ title: err?.message || "Terjadi kesalahan" });
    } finally {
      setSubmitting(false);
    }
  };

  // Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nik) return toast({ title: "❌ ID tidak ditemukan" });
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const body = {
        nik: form.nik,
        jenis_kerusakan: form.jenis_kerusakan,
        keterangan: form.keterangan,
      };

      const res = await fetch(`/api/rumah/${form.id_rumah_rusak}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal memperbarui data korban");

      toast({ title: "✅ Data berhasil diperbarui" });
      setOpenEdit(false);
      resetForm();
      fetchSurveys();
    } catch (err: any) {
      console.error(err);
      toast({ title: err?.message || "Terjadi kesalahan" });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id_rumah_rusak: number) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      const res = await fetch(`/api/rumah/${id_rumah_rusak}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Gagal menghapus data");

      toast({ title: "🗑️ Data berhasil dihapus" });
      setSurveys((prev) => prev.filter((s) => s.id_rumah_rusak !== id_rumah_rusak));
    } catch (err: any) {
      console.error(err);
      toast({ title: err?.message || "Terjadi kesalahan" });
    }
  };

  
  // Filtered & Pagination
  const filteredSurveys = surveys.filter((s) => {
    const q = filterQuery.toLowerCase();

    const nik = s.nik?.toLowerCase() || "";
    const jenis_kerusakan = s.jenis_kerusakan?.toLowerCase() || "";
    const keterangan = s.keterangan?.toLowerCase() || "";

    const matchText =
      !filterQuery ||
      nik.includes(q) ||
      jenis_kerusakan.includes(q) ||
      keterangan.includes(q);

    const matchStatus =
      !filterStatusKorban || s.jenis_kerusakan === filterStatusKorban;

    const kec = s.korban?.kejadian?.desa?.kecamatan?.nm_kecamatan || "";

    const matchKecamatan =
        filterKecamatan === "" || kec === filterKecamatan;

        return matchText && matchStatus && matchKecamatan;
    });

  

  const totalPages = Math.max(1, Math.ceil(filteredSurveys.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSurveys = filteredSurveys.slice(startIndex, startIndex + itemsPerPage);

  // Export Excel
 

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
        active="rumah"
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
            <h2 className="text-xl font-bold">📋 Data Rumah</h2>

            <div className="flex gap-2 items-center">

              <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogTrigger asChild>
                  <Button
                    disabled={submitting}
                    onClick={() => {
                      resetForm();
                      setOpenAdd(true);
                    }}
                    className="font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    aria-label="Tambah Rumah"
                  >
                    + Tambah Rumah
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-screen-lg w-full rounded-xl shadow-2xl p-0 overflow-hidden">
                  <DialogHeader className="border-b px-6 py-4 bg-gray-50">
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                      Tambah Data Rumah
                    </DialogTitle>
                  </DialogHeader>

                  <ScrollArea className="max-h-[75vh] px-6 py-4">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="Form tambah korban">
                      <Card className="col-span-full p-4 border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-gray-700 mb-3">📋 Informasi Umum</h3>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                         <label className="text-sm font-medium text-gray-600">Nama Korban</label>
                           <Select
                            options={korbanOptions}
                            value={selectedKorban}
                            onChange={(opt) => {
                                setSelectedKorban(opt);
                                setForm(prev => ({ ...prev, nik: opt?.value || "" }));
                            }}
                            placeholder="Cari nama korban..."
                            isSearchable
                            />
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                       
                         <div>
                          <label htmlFor="status" className="text-sm font-medium text-gray-600">Jenis Kerusakan</label>
                          <select id="status" value={form.jenis_kerusakan} onChange={(e) => setForm({ ...form, jenis_kerusakan: e.target.value })} className="border border-gray-300 p-2 rounded w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Pilih</option>
                            <option value="RusakRingan">RusakRingan</option>
                            <option value="RusakBerat">RusakBerat</option>
                            <option value="Hilang">Hilang</option>
                          </select>
                        </div>
                        </div>
                          <InputField id="alamat" label="Keterangan" type="textarea" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} />
                        </div>
                      </Card>

                      <Separator className="col-span-full" />

                      <div className="col-span-full flex justify-end pt-2">
                        <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow-sm" aria-label="Simpan Korban">
                          {submitting ? "Menyimpan..." : "💾 Simpan"}
                        </Button>
                      </div>
                    </form>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>

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
              <option value="RusakRingan">RusakRingan</option>
              <option value="RusakBerat">RusakBerat</option>
              <option value="Hilang">Hilang</option>
            </select>

            {/* Filter Kecamatan */}
            <select
              value={filterKecamatan}
              onChange={(e) => {
                const v = e.target.value;
                setFilterKecamatan(v);
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

            <Button
              variant="secondary"
              onClick={() => {
                setFilterQuery("");
                setFilterKecamatan("");
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
                      <TableHead className="w-12 text-center">No</TableHead>
                      <TableHead>Nama Korban</TableHead>
                      <TableHead>NIK</TableHead>
                      <TableHead>Jenis Kerusakan</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead>Nama Kejadian</TableHead>
                      <TableHead>Kecamatan</TableHead>
                      <TableHead>Desa</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSurveys.map((s, index) => (
                      <TableRow key={s.id_rumah_rusak}>
                        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                        <TableCell>{s.korban?.nama_korban}</TableCell>
                        <TableCell>{s.nik}</TableCell>
                        <TableCell>{s.jenis_kerusakan}</TableCell>
                        <TableCell>{s.keterangan}</TableCell>
                        <TableCell>{s.korban?.kejadian?.nm_kejadian}</TableCell>
                        <TableCell>{s.korban?.kejadian?.desa?.kecamatan?.nm_kecamatan}</TableCell>
                        <TableCell>{s.korban?.kejadian?.desa?.nm_desa}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                                setForm({
                                id_rumah_rusak: String(s.id_rumah_rusak),
                                nik: s.nik,
                                jenis_kerusakan: String(s.jenis_kerusakan),
                                keterangan: s.keterangan,
                                });

                                // 🔥 WAJIB! Set default value untuk react-select
                                setSelectedKorban({
                                label: s.korban?.nama_korban,
                                });

                                setOpenEdit(true);
                            }}
                            >
                            ✏️ Detail
                            </Button>

                          <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id_rumah_rusak)}>🗑️ Hapus</Button>
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
                <DialogTitle className="text-xl font-semibold text-gray-800">Edit Data Rumah</DialogTitle>
              </DialogHeader>

              <ScrollArea className="max-h-[75vh] px-6 py-4">
                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="col-span-full p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-3">📋 Informasi Umum</h3>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                   <label className="text-sm font-medium text-gray-600">Nama Korban</label>
                       <Select
                            options={korbanOptions}
                            value={selectedKorban}
                            onChange={(opt) => {
                                setSelectedKorban(opt);
                                setForm(prev => ({ ...prev, nik: opt?.value || "" }));
                            }}
                            placeholder="Cari nama korban..."
                            isSearchable
                            />
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div>
                          <label htmlFor="status" className="text-sm font-medium text-gray-600">Jenis Kerusakan</label>
                          <select id="editstatus" value={form.jenis_kerusakan} onChange={(e) => setForm({ ...form, jenis_kerusakan: e.target.value })} className="border border-gray-300 p-2 rounded w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Pilih</option>
                            <option value="RusakRingan">RusakRingan</option>
                            <option value="RusakBerat">RusakBerat</option>
                            <option value="Hilang">Hilang</option>
                          </select>
                        </div>
                    </div>
                      <InputField id="editalamat" label="Keterangan" type="textarea" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} />
                    </div>
                  </Card>

                  <Separator className="col-span-full" />

                  <div className="col-span-full flex justify-end pt-2">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={submitting}
                    >
                      {submitting ? "Memperbarui..." : "💾 Update"}
                    </Button>
                  </div>
                </form>
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
  id?: string;
  label: string;
  type?: string;
  value: any;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  required?: boolean;
  inputMode?: "numeric" | "text" | "decimal" | undefined;
};

function InputField({ id, label, type = "text", value, onChange, required = false, inputMode }: InputFieldProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-600">{label}</label>

      {type === "textarea" ? (
        <textarea
          id={id}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          className="border rounded-md p-2 h-24 resize-none"
          placeholder={label}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          placeholder={label}
          inputMode={inputMode}
          className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      )}
    </div>
  );
}

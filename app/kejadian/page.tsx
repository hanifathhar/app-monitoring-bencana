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
  id_posko: number;
  posko: string;
  role: string;
}

interface Survey {
  id_kejadian: number;
  nm_kejadian: string;
  jns_kejadian: string;
  skala: string;
  id_desa: number;
  id_kecamatan: number;
  desa: { nm_desa: string };
  kecamatan: { nm_kecamatan: string };
  tgl_kejadian: string;
}

export default function SurveyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaList, setDesaList] = useState<any[]>([]);

  const [mapModal, setMapModal] = useState(false);



  const formatDate = (tgl: string) => {
    const d = new Date(tgl);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Filter
  const [filterKecamatan, setFilterKecamatan] = useState("");
  const [filterDesa, setFilterDesa] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form (note: coordinates stored as strings in form, converted to Number on submit)
  const [form, setForm] = useState({
    id_kejadian: "",
    nm_kejadian: "",
    jns_kejadian: "",
    skala: "",
    id_desa: "",
    id_kecamatan: "",
    tgl_kejadian: "",
  });

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const resetForm = () => {
    setForm({
      id_kejadian: "",
      nm_kejadian: "",
      jns_kejadian: "",
      skala: "",
      id_desa: "",
      id_kecamatan: "",
      tgl_kejadian: "",
    });
  };

  // Cek user login & role
   useEffect(() => {
     const fetchUser = async () => {
       const res = await fetch("/api/me");
       if (res.ok) {
         const data = await res.json();
         setUser(data.user);
         setForm((f) => ({ ...f, createdById: data.user.id }));
 
         // 🚨 CEK ROLE USER DI SINI
         if (data.user.role !== "PETUGAS" && data.user.role !== "ADMIN") {
           window.location.href = "/unauthorized";
         }
       } else {
         window.location.href = "/login";
       }
     };
     fetchUser();
   }, []);

  // Ambil master kecamatan & desa
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const kec = await fetch("/api/kecamatan").then((r) => r.json());
        const desa = await fetch("/api/desa").then((r) => r.json());
        setKecamatanList(kec);
        setDesaList(desa);
      } catch (e) {
        toast({ title: "⚠️ Gagal memuat data kecamatan/desa" });
      }
    };
    fetchMasterData();
  }, []);

  // Ambil survey
  const fetchSurveys = async () => {
    try {
      const res = await fetch("/api/kejadian");
      if (!res.ok) throw new Error("Gagal memuat data survey");
      const json = await res.json();
      setSurveys(json);
    } catch {
      toast({ title: "❌ Gagal memuat data survey" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSurveys();
  }, []);

  // Validasi
  const validateForm = () => {
    if (!form.nm_kejadian || !form.jns_kejadian || !form.skala || !form.id_desa || !form.id_kecamatan) {
      toast({ title: "⚠️ Semua field utama wajib diisi" });
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
        ...form,
        id_desa: Number(form.id_desa),
        id_kecamatan: Number(form.id_kecamatan),
        nm_kejadian: form.nm_kejadian,
        jns_kejadian: form.jns_kejadian,
        skala: form.skala,
      };

      const res = await fetch("/api/kejadian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menambah survey");

      toast({ title: "✅ Survey berhasil ditambahkan" });
      setOpen(false);
      resetForm();
      fetchSurveys();
    } catch (err: any) {
      toast({ title: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Export Excel
  

  // Export PDF (fix autoTable import usage)

  
  

  // Update
  const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.id_kejadian) return toast({ title: "❌ ID tidak ditemukan" });

  setSubmitting(true);

  try {
    const body = {
      ...form,
      id_desa: Number(form.id_desa),
      id_kecamatan: Number(form.id_kecamatan),
      nm_kejadian: form.nm_kejadian,
      jns_kejadian: form.jns_kejadian,
      skala: form.skala,
      // gunakan tanggal dari form, bukan item!
      tgl_kejadian: form.tgl_kejadian,
    };

    const res = await fetch(`/api/kejadian/${form.id_kejadian}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Gagal memperbarui survey");

    toast({ title: "✅ Data berhasil diperbarui" });
    setEditOpen(false);
    fetchSurveys();
  } catch (err: any) {
    toast({ title: err.message });
  } finally {
    setSubmitting(false);
  }
};

  // Delete
  const handleDelete = async (id_kejadian: number) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      const res = await fetch(`/api/kejadian/${id_kejadian}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menghapus data");

      toast({ title: "🗑️ Data berhasil dihapus" });
      setSurveys((prev) => prev.filter((s) => s.id_kejadian !== id_kejadian));
    } catch (err: any) {
      toast({ title: err.message });
    }
  };

  // Filtered & Pagination
  const filteredSurveys = surveys.filter((s) => {
    const matchKec = filterKecamatan
      ? s.kecamatan?.nm_kecamatan
          ?.toLowerCase()
          .includes(filterKecamatan.toLowerCase())
      : true;
    const matchDesa = filterDesa
      ? s.desa?.nm_desa?.toLowerCase().includes(filterDesa.toLowerCase())
      : true;
    return matchKec && matchDesa;
  });

  const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSurveys = filteredSurveys.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Memuat...
      </div>
    );

  // -------------------
  // MapPicker component (inline in same file)
  // -------------------
 

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        active="kejadian"
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
            <h2 className="text-xl font-bold">📋 Daftar Kejadian Bencana</h2>

            <Dialog open={open} onOpenChange={setOpen}>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <DialogTrigger asChild>
                  <Button
                    disabled={submitting}
                    onClick={() => resetForm()}
                    className="font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    aria-label="Tambah Kejadian Bencana"
                  >
                    + Tambah Kejadian
                  </Button>
                </DialogTrigger>
              </div>

              <DialogContent className="sm:max-w-screen-lg w-full rounded-xl shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="border-b px-6 py-4 bg-gray-50">
                  <DialogTitle className="text-xl font-semibold text-gray-800">
                    Tambah Kejadian Bencana
                  </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[75vh] px-6 py-4">
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="Form tambah kejadian">
                    {/* Informasi Umum */}
                    <Card className="col-span-full p-4 border border-gray-200 shadow-sm">
                      <h3 className="font-semibold text-gray-700 mb-3">📋 Informasi Umum</h3>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <InputField id="nm_kejadian" label="Nama Kejadian" value={form.nm_kejadian} onChange={(e) => setForm({ ...form, nm_kejadian: e.target.value })} required />
                        <InputField
                          id="tgl"
                          label="Tanggal Kejadian"
                          type="date"
                          value={form.tgl_kejadian}
                          onChange={(e) =>
                            setForm({ ...form, tgl_kejadian: e.target.value })
                          }
                          required
                        />
                        
                        <div>
                          <label htmlFor="jnskejadian" className="text-sm font-medium text-gray-600">Jenis Kejadian</label>
                          <select id="jnskejadian" value={form.jns_kejadian} onChange={(e) => setForm({ ...form, jns_kejadian: e.target.value })} className="border border-gray-300 p-2 rounded w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Pilih Jenis Kejadian</option>
                            <option value="Banjir">Banjir</option>
                            <option value="Longsor">Longsor</option>
                            <option value="Gempa">Gempa</option>
                            <option value="Kebakaran">Kebakaran</option>
                            <option value="Kekeringan">Kekeringan</option>
                            <option value="Epedemi">Gempa</option>
                          </select>
                        </div>
                         <div>
                          <label htmlFor="skala" className="text-sm font-medium text-gray-600">Tingkat Keparahan</label>
                          <select id="skala" value={form.skala} onChange={(e) => setForm({ ...form, skala: e.target.value })} className="border border-gray-300 p-2 rounded w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Pilih Tingkat Keparahan</option>
                            <option value="Ringan">Ringan</option>
                            <option value="Sedang">Sedang</option>
                            <option value="Berat">Berat</option>
                            <option value="Sangat Berat">Sangat Berat</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="kecamatanId" className="text-sm font-medium text-gray-600">Kecamatan</label>
                          <select id="id_kecamatan" value={form.id_kecamatan} onChange={(e) => setForm({ ...form, id_kecamatan: e.target.value, id_desa: "" })} required className="border border-gray-300 p-2 rounded w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Pilih Kecamatan</option>
                            {kecamatanList.map((k: any) => (
                              <option key={k.id_kecamatan} value={k.id_kecamatan}>{k.nm_kecamatan}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="desaId" className="text-sm font-medium text-gray-600">Desa</label>
                          <select id="id_desa" value={form.id_desa} onChange={(e) => setForm({ ...form, id_desa: e.target.value })} required className="border border-gray-300 p-2 rounded w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Pilih Desa</option>
                            {desaList.filter((d: any) => Number(d.id_kecamatan) === Number(form.id_kecamatan)).map((d: any) => (
                              <option key={d.id_desa} value={d.id_desa}>{d.nm_desa}</option>
                            ))}
                          </select>
                        </div>
                        </div>
                      </div>
                    </Card>
                   

                    <Separator className="col-span-full" />

                    <div className="col-span-full flex justify-end pt-2">
                      <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow-sm" aria-label="Simpan Survey">
                        {submitting ? "Menyimpan..." : "💾 Simpan"}
                      </Button>
                    </div>
                  </form>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter */}
          <div className="flex gap-3 bg-white p-4 rounded-lg shadow items-center">
            <Input placeholder="Cari Kecamatan..." value={filterKecamatan} onChange={(e) => { setFilterKecamatan(e.target.value); setCurrentPage(1); }} className="max-w-xs" />
            <Input placeholder="Cari Desa..." value={filterDesa} onChange={(e) => { setFilterDesa(e.target.value); setCurrentPage(1); }} className="max-w-xs" />
            <Button variant="secondary" onClick={() => { setFilterKecamatan(""); setFilterDesa(""); }}>Reset</Button>
          </div>

          {/* Table */}
          <div className="bg-white p-5 rounded-xl shadow">
            {loading ? <p>Loading...</p> : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">No</TableHead>
                      <TableHead>Nama Kejadian</TableHead>
                       <TableHead>Tanggal Kejadian</TableHead>
                      <TableHead>Jenis Kejadian</TableHead>
                      <TableHead>Tingkat Keparahan</TableHead>
                      <TableHead>Desa/Kelurahan</TableHead>
                      <TableHead>Kecamatan</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSurveys.map((s, index) => (
                      <TableRow key={s.id_kejadian}>
                         <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>{s.nm_kejadian}</TableCell>
                        <TableCell>{formatDate(s.tgl_kejadian)}</TableCell>
                         <TableCell>{s.jns_kejadian}</TableCell>
                          <TableCell>{s.skala}</TableCell>
                        <TableCell>{s.desa?.nm_desa}</TableCell>
                        <TableCell>{s.kecamatan?.nm_kecamatan}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                            setForm({
                              id_kejadian: String(s.id_kejadian),
                              nm_kejadian: s.nm_kejadian,
                              jns_kejadian: s.jns_kejadian,
                              skala: s.skala,
                              id_desa: String(s.id_desa),
                              id_kecamatan: String(s.id_kecamatan),
                              tgl_kejadian: s.tgl_kejadian,
                            });
                            setEditOpen(true);
                          }}>✏️ Detail</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(s.id_kejadian)}>🗑️ Hapus</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-500">Menampilkan {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredSurveys.length)} dari {filteredSurveys.length} data</p>
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
          {/* MAP MODAL */}
          <Dialog open={mapModal} onOpenChange={setMapModal}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Data Kejadian</DialogTitle>
              </DialogHeader>
              
            </DialogContent>
          </Dialog>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-screen-lg w-full rounded-xl shadow-2xl p-0 overflow-hidden">
              <DialogHeader className="border-b px-6 py-4 bg-gray-50">
                <DialogTitle className="text-xl font-semibold text-gray-800">Edit Data Kejadian</DialogTitle>
              </DialogHeader>

              <ScrollArea className="max-h-[75vh] px-6 py-4">
                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Informasi Umum */}
                  <Card className="col-span-full p-4 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-3">📋 Informasi Umum</h3>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <InputField id="editnm_kejadian" label="Nama Kejadian" value={form.nm_kejadian} onChange={(e) => setForm({ ...form, nm_kejadian: e.target.value })} required />

                      <div>
                        <InputField
                          id="tgl"
                          label="Tanggal Kejadian"
                          value={formatDate(form.tgl_kejadian)}
                          onChange={(e) => setForm({ ...form, tgl_kejadian: formatDate(e.target.value) })}
                          required
                          type="date"
                        />
                      </div>
                       <div>
                          <label htmlFor="jnskejadian" className="text-sm font-medium text-gray-600">Jenis Kejadian</label>
                          <select id="jnskejadian" value={form.jns_kejadian} onChange={(e) => setForm({ ...form, jns_kejadian: e.target.value })} className="border border-gray-300 p-2 rounded w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Pilih Jenis Kejadian</option>
                            <option value="Banjir">Banjir</option>
                            <option value="Longsor">Longsor</option>
                            <option value="Gempa">Gempa</option>
                            <option value="Kebakaran">Kebakaran</option>
                            <option value="Kekeringan">Kekeringan</option>
                            <option value="Epedemi">Gempa</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="skala" className="text-sm font-medium text-gray-600">Tingkat Keparahan</label>
                          <select id="skala" value={form.skala} onChange={(e) => setForm({ ...form, skala: e.target.value })} className="border border-gray-300 p-2 rounded w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Pilih Tingkat Keparahan</option>
                            <option value="Ringan">Ringan</option>
                            <option value="Sedang">Sedang</option>
                            <option value="Berat">Berat</option>
                            <option value="Sangat Berat">Sangat Berat</option>
                          </select>
                        </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                        <label htmlFor="editid_kecamatan" className="text-sm font-medium text-gray-600">Kecamatan</label>
                        <select id="editid_kecamatan" value={form.id_kecamatan} onChange={(e) => setForm({ ...form, id_kecamatan: e.target.value, id_desa: "" })} required className="border border-gray-300 p-2 rounded w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="">Pilih Kecamatan</option>
                          {kecamatanList.map((k: any) => (<option key={k.id_kecamatan} value={k.id_kecamatan}>{k.nm_kecamatan}</option>))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="editid_desa" className="text-sm font-medium text-gray-600">Desa</label>
                        <select id="id_desa" value={form.id_desa} onChange={(e) => setForm({ ...form, id_desa: e.target.value })} required className="border border-gray-300 p-2 rounded w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="">Pilih Desa</option>
                          {desaList.filter((d: any) => Number(d.id_kecamatan) === Number(form.id_kecamatan)).map((d: any) => (<option key={d.id_desa} value={d.id_desa}>{d.nm_desa}</option>))}
                        </select>
                      </div>
                      </div>
                    </div>
                  </Card>

                  {/* Identitas */}
                  

                  {/* Kondisi + Map for edit */}
                 

                  <Separator className="col-span-full" />

                  <div className="col-span-full flex justify-end pt-2">
                   <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}

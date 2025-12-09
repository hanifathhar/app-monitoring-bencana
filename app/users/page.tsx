"use client";

import React, { useEffect, useMemo, useState } from "react";
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

type Role = "ADMIN" | "PETUGAS" | string;

interface Posko {
  id_posko: number;
  nm_posko: string;
}

interface User {
  id: number;
  nama: string;
  username: string;
  role: Role;
  id_posko: number;
  posko?: Posko | null;
}

/**
 * User Management Page
 * - responsive layout
 * - dropdown posko for add/edit
 * - client-side pagination
 * - improved UX and validation
 */
export default function UserManagementPage() {
  const [me, setMe] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [poskoList, setPoskoList] = useState<Posko[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // dialog states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // filter & pagination
  const [query, setQuery] = useState("");
  const [selectedPoskoFilter, setSelectedPoskoFilter] = useState<number | "all">("all");
  const [page, setPage] = useState(1);
  const perPage = 8;

  // form state (shared for add & edit)
  const [form, setForm] = useState({
    id: "",
    nama: "",
    username: "",
    password: "",
    id_posko: 0,
    role: "" as Role,
  });

  // load current user (me)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (!res.ok) {
          window.location.href = "/login";
          return;
        }
        const json = await res.json();
        setMe(json.user as User);
        if (json.user?.role !== "ADMIN") {
          // only admin allowed
          window.location.href = "/unauthorized";
        }
      } catch (err) {
        console.error(err);
        window.location.href = "/login";
      }
    })();
  }, []);

  // fetch users and posko
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data user");
      const json = await res.json();
      // assume API returns array of users
      setUsers(Array.isArray(json) ? (json as User[]) : json.users || []);
    } catch (err: any) {
      console.error(err);
      toast({ title: "❌ Gagal memuat data user" });
    } finally {
      setLoading(false);
    }
  };

  const fetchPosko = async () => {
    try {
      const res = await fetch("/api/posko", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat posko");
      const json = await res.json();
      // support both {data:[]} or [] return shapes
      const list = Array.isArray(json) ? json : json.data ?? json.posko ?? [];
      setPoskoList(list);
    } catch (err) {
      console.error(err);
      toast({ title: "⚠️ Gagal memuat daftar posko" });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPosko();
  }, []);

  // derived filtered data
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (selectedPoskoFilter !== "all" && u.id_posko !== selectedPoskoFilter) return false;
      if (!q) return true;
      return (
        u.nama.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        (u.posko?.nm_posko ?? "").toLowerCase().includes(q)
      );
    });
  }, [users, query, selectedPoskoFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  // reset form helper
  const resetForm = () =>
    setForm({
      id: "",
      nama: "",
      username: "",
      password: "",
      id_posko: 0,
      role: "",
    });

  // validation
  const validateForm = (isEdit = false) => {
    if (!form.nama.trim()) {
      toast({ title: "⚠️ Nama wajib diisi" });
      return false;
    }
    if (!form.username.trim()) {
      toast({ title: "⚠️ Username wajib diisi" });
      return false;
    }
    if (!form.role) {
      toast({ title: "⚠️ Pilih role" });
      return false;
    }
    if (!form.id_posko || Number(form.id_posko) === 0) {
      toast({ title: "⚠️ Pilih posko" });
      return false;
    }
    if (!isEdit && !form.password.trim()) {
      toast({ title: "⚠️ Password wajib diisi untuk user baru" });
      return false;
    }
    return true;
  };

  // add user
  const handleAdd = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateForm(false)) return;
    setSubmitting(true);
    try {
      const payload = {
        nama: form.nama.trim(),
        username: form.username.trim(),
        password: form.password,
        role: form.role,
        id_posko: Number(form.id_posko),
      };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menambah user");
      toast({ title: "✅ User berhasil ditambahkan" });
      setOpenAdd(false);
      resetForm();
      await fetchUsers();
    } catch (err: any) {
      console.error(err);
      toast({ title: "❌ " + (err.message || "Gagal menambah user") });
    } finally {
      setSubmitting(false);
    }
  };

  // open edit modal and set form
  const openEditModal = (u: User) => {
    setForm({
      id: String(u.id),
      nama: u.nama,
      username: u.username,
      password: "",
      id_posko: u.id_posko,
      role: u.role,
    });
    setOpenEdit(true);
  };

  // update user
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id) {
      toast({ title: "❌ ID user tidak ditemukan" });
      return;
    }
    if (!validateForm(true)) return;
    setSubmitting(true);
    try {
      const payload: any = {
        nama: form.nama.trim(),
        username: form.username.trim(),
        role: form.role,
        id_posko: Number(form.id_posko),
      };
      if (form.password && form.password.trim() !== "") payload.password = form.password;

      const res = await fetch(`/api/auth/register/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengupdate user");
      toast({ title: "✅ User berhasil diperbarui" });
      setOpenEdit(false);
      resetForm();
      await fetchUsers();
    } catch (err: any) {
      console.error(err);
      toast({ title: "❌ " + (err.message || "Gagal mengupdate user") });
    } finally {
      setSubmitting(false);
    }
  };

  // delete
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;
    try {
      const res = await fetch(`/api/auth/register/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menghapus user");
      toast({ title: "🗑️ User dihapus" });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      console.error(err);
      toast({ title: "❌ " + (err.message || "Gagal menghapus user") });
    }
  };

  // helper to render role badge
  const RoleBadge = ({ role }: { role: Role }) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold inline-block";
    if (role === "ADMIN") return <span className={`${base} bg-red-100 text-red-700`}>Admin</span>;
    return <span className={`${base} bg-blue-100 text-blue-700`}>{role}</span>;
  };

  // small responsive UI pieces
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="users" />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header
          user={me}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
        />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">👥 Manajemen User</h1>
              <p className="text-sm text-gray-500 mt-1">Kelola user, role, dan posko</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <select
                  value={selectedPoskoFilter}
                  onChange={(e) =>
                    setSelectedPoskoFilter(e.target.value === "all" ? "all" : Number(e.target.value))
                  }
                  className="border rounded p-2 text-sm"
                >
                  <option value="all">Semua Posko</option>
                  {poskoList.map((p) => (
                    <option key={p.id_posko} value={p.id_posko}>
                      {p.nm_posko}
                    </option>
                  ))}
                </select>

                <Input
                  placeholder="Cari nama, username, posko..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  className="max-w-xs"
                />
              </div>

              <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 text-white">+ Tambah User</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Tambah User Baru</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleAdd} className="space-y-3 mt-4">
                    <Input
                      placeholder="Nama lengkap"
                      value={form.nama}
                      onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    />
                    <Input
                      placeholder="Username"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Pilih Role</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="PETUGAS">PETUGAS</option>
                    </select>

                    <select
                      value={form.id_posko}
                      onChange={(e) => setForm({ ...form, id_posko: Number(e.target.value) })}
                      className="w-full p-2 border rounded"
                    >
                      <option value={0}>Pilih Posko</option>
                      {poskoList.map((p) => (
                        <option key={p.id_posko} value={p.id_posko}>
                          {p.nm_posko}
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setOpenAdd(false);
                          resetForm();
                        }}
                      >
                        Batal
                      </Button>
                      <Button type="submit" disabled={submitting} className="bg-blue-600 text-white">
                        {submitting ? "Menyimpan..." : "Simpan"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* table card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
  <thead className="bg-gray-100 text-xs font-semibold">
    <tr>
      <th className="px-3 py-2">No</th>
      <th className="px-3 py-2">Nama</th>
      <th className="px-3 py-2">Username</th>
      <th className="px-3 py-2">Posko</th>
      <th className="px-3 py-2">Role</th>
      <th className="px-3 py-2 text-center">Aksi</th>
    </tr>
  </thead>

  <tbody>
    {users.length === 0 ? (
      <tr>
        <td colSpan={6} className="py-4 text-center text-gray-500">
          Tidak ada data
        </td>
      </tr>
    ) : (
      users.map((user, index) => (
        <tr
          key={user.id}
          className="border-b hover:bg-gray-50 transition"
        >
          <td className="px-3 py-2">{index + 1}</td>
          <td className="px-3 py-2">{user.nama}</td>
          <td className="px-3 py-2">{user.username}</td>
          <td className="px-3 py-2">{user.posko?.nm_posko}</td>

          <td className="px-3 py-2">
            <span
              className={`px-2 py-1 rounded-full text-white text-xs ${
                user.role === "ADMIN" ? "bg-blue-600" : "bg-green-600"
              }`}
            >
              {user.role}
            </span>
          </td>

          <td className="px-3 py-2 flex gap-2 justify-center">
           
              <Button
                              size="sm"
                              className="bg-yellow-500 text-white"
                              onClick={() => openEditModal(user)}
                            >
                              ✏️ Edit
                            </Button>
            <button
              onClick={() => handleDelete(user.id)}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Hapus
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

            </div>

            {/* pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 border-t">
              <div className="text-sm text-gray-600">
                Menampilkan <span className="font-medium">{filtered.length}</span> hasil
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>

                <div className="px-3 py-1 border rounded text-sm">
                  {page} / {totalPages}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

          {/* EDIT DIALOG */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleUpdate} className="space-y-3 mt-4">
                <Input
                  placeholder="Nama lengkap"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                />
                <Input
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                <Input
                  type="password"
                  placeholder="Password (kosongkan jika tidak berubah)"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="PETUGAS">PETUGAS</option>
                </select>

                <select
                  value={form.id_posko}
                  onChange={(e) => setForm({ ...form, id_posko: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                >
                  <option value={0}>Pilih Posko</option>
                  {poskoList.map((p) => (
                    <option key={p.id_posko} value={p.id_posko}>
                      {p.nm_posko}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setOpenEdit(false);
                      resetForm();
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={submitting} className="bg-blue-600 text-white">
                    {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}

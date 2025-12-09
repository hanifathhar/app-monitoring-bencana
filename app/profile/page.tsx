"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface User {
  id: number;
  nama: string;
  username: string;
  id_posko: number;
  posko: string;
  role: string;
  posko_alamat?: string; // 🔥 alamat posko
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notif, setNotif] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        window.location.href = "/login";
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setNotif({
        type: "error",
        message: "Password baru dan konfirmasi password tidak cocok.",
      });
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setNotif({ type: "success", message: "Password berhasil dirubah." });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setNotif({ type: "error", message: data.error || "Gagal mengubah password" });
      }
    } catch (err) {
      setNotif({ type: "error", message: "Terjadi Kesalahan server" });
      console.error(err);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Memuat profil...</p>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        active="profile"
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
          {/* === Card Profil Modern === */}
          <section className="bg-white rounded-2xl shadow p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {user?.nama?.charAt(0)}
            </div>

            <div className="flex-1 space-y-2 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{user?.nama}</h2>
               {/* Badge Role */}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold inline-block mt-2 ${
                  user?.role === "admin"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {user?.role === "admin" ? "Admin" : "Petugas"}
              </span>

              {/* Nama Posko */}
              <p className="text-gray-700 font-semibold">{user?.posko}</p>

             

              {/* === Alamat Posko === */}
              {user?.posko_alamat && (
                <div className="flex items-start gap-2 mt-3 justify-center lg:justify-start">
                  <p className="text-gray-700 leading-snug max-w-lg">
                    {user.posko_alamat}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* === Form Ubah Password === */}
          <section className="bg-white rounded-2xl shadow p-6 lg:p-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Ubah Password</h3>

            {notif && (
              <div
                className={`p-3 mb-4 rounded-lg text-sm ${
                  notif.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {notif.message}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <Label>Password Lama</Label>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Password Baru</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Konfirmasi Password Baru</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="mt-2 bg-blue-600 hover:bg-blue-700 w-full"
              >
                Simpan Perubahan
              </Button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

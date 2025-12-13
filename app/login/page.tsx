"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
  {
    title: "Banjir Bandang",
    desc: "Bencana banjir bandang melanda beberapa kecamatan di Tapanuli Selatan.",
  },
  {
    title: "Tanah Longsor",
    desc: "Wilayah perbukitan Tapsel rawan longsor saat curah hujan tinggi.",
  },
  {
    title: "Angin Puting Beliung",
    desc: "Puluhan rumah warga mengalami kerusakan akibat angin kencang.",
  },
];

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const router = useRouter();

  /* 🔄 AUTO SLIDER */
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotif(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setNotif({ type: "error", message: data.error || "Login gagal." });
      } else {
        setNotif({ type: "success", message: "Login berhasil! Mengarahkan ke dashboard..." });
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    } catch {
      setNotif({ type: "error", message: "Gagal terhubung ke server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* KIRI: FORM LOGIN */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white px-8 md:px-16 relative"
      >
        <div className="w-full max-w-sm space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Selamat Datang
          </h2>
          <p className="text-center text-gray-500">
            Silakan masuk untuk melanjutkan
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            <div>
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
              />
            </div>

            <div className="relative">
              <Label>Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Memproses..." : "Login"}
            </Button>
          </form>
        </div>

        {/* NOTIF */}
        <AnimatePresence>
          {notif && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`absolute bottom-8 flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
                notif.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {notif.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
              {notif.message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* KANAN: SLIDER BENCANA */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-blue-600 to-indigo-700 items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.6 }}
            className="text-white text-center px-10 max-w-lg"
          >
            <h2 className="text-4xl font-bold mb-4">
              {SLIDES[slideIndex].title}
            </h2>
            <p className="text-lg text-gray-100">
              {SLIDES[slideIndex].desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* DOT INDICATOR */}
        <div className="absolute bottom-10 flex gap-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === slideIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

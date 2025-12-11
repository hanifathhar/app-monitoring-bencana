"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";

import {
  Users,
  Activity,
  HeartPulse,
  AlertTriangle,
  Tent,
  Package,
  Home,
} from "lucide-react";

import KorbanBarChart from "./BarChart";

// ===================== CSS BLINK =====================
const blinkStyle = `
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: .3; }
  100% { opacity: 1; }
}
`;

interface User {
  id: number;
  nama: string;
  username: string;
  id_posko: number;
  posko: string;
  posko_alamat?: string;
  role: string;
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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [korban, setKorban] = useState({
    total: 0,
    luka: 0,
    meninggal: 0,
    hilang: 0,
    mengungsi: 0,
    totalkejadian: 0,
  });

  const [rumah, setRumah] = useState({
    totalrumah: 0,
  });

  const [dataKecamatan, setDataKecamatan] = useState<DataKecamatan[]>([]);

  // ============ FETCH DATA ============
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        window.location.href = "/login";
      }
    };

    const fetchKorban = async () => {
      const res = await fetch("/api/rekap");
      const data = await res.json();

      setKorban({
        total: data.total || 0,
        luka: data.luka || 0,
        meninggal: data.meninggal || 0,
        hilang: data.hilang || 0,
        mengungsi: data.mengungsi || 0,
        totalkejadian: data.totalkejadian || 0,
      });

      setRumah({
        totalrumah: data.totalrumah || 0,
      });
    };

    const fetchKecamatan = async () => {
      const res = await fetch("/api/rekap-kecamatan");
      const data = await res.json();

      const mapped = data.map((item: any) => ({
        kecamatan: item.nm_kecamatan,
        total: Number(item.total_korban),
        meninggal: Number(item.total_meninggal),
        luka: Number(item.total_luka),
        hilang: Number(item.total_hilang),
        mengungsi: Number(item.total_mengungsi),
        totalkejadian: Number(item.total_kejadian),

        rumahrusak: Number(item.total_rumah_rusak),
        rusakringan: Number(item.total_rusak_ringan),
        rumahhilang: Number(item.total_rumah_hilang),
        rusakberat: Number(item.total_rusak_berat),
      }));

      setDataKecamatan(mapped);
    };

    fetchUser();
    fetchKorban();
    fetchKecamatan();
  }, []);

  if (!user) return <div className="flex justify-center p-10">Memuat...</div>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <style>{blinkStyle}</style>

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        active="dashboard"
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

        <main className="p-6 space-y-10">
          {/* ================== WELCOME SECTION ================== */}
          <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-2">Selamat Datang, {user.nama}</h2>
            <p className="text-sm text-blue-100">{user.posko}</p>
            <p className="text-sm text-blue-100">{user.posko_alamat}</p>
          </section>

          {/* ===================================================== */}
          {/*              A. INFORMASI KORBAN                     */}
          {/* ===================================================== */}

          <h2 className="text-xl font-bold text-gray-700">A. Informasi Korban</h2>

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

          {/* PIE CHART KORBAN */}
          {/* ===================== PIECHART + TABEL KORBAN ===================== */}
          <section className="bg-white p-6 rounded-xl shadow">
  <h2 className="text-lg font-semibold mb-5">Distribusi Korban per Kecamatan</h2>

  <div className="flex flex-col lg:flex-row gap-6 w-full">
    {/* ================= PIE CHART ================= */}
    <div className="flex-1">
      {/* FIX: Tinggi wajib definite agar ResponsiveContainer tidak collapse */}
      <div className="w-full h-[300px]">
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

      </div>
    </div>

    {/* ==================== TABEL SAMPING ==================== */}
    <div className="flex-1 max-h-[400px] overflow-auto border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 sticky top-0 text-sm">
          <tr>
            <th className="p-2 border">Kecamatan</th>
            <th className="p-2 border text-center">Total</th>
            <th className="p-2 border text-center">Meninggal</th>
            <th className="p-2 border text-center">Luka</th>
            <th className="p-2 border text-center">Hilang</th>
            <th className="p-2 border text-center">Mengungsi</th>
          </tr>
        </thead>
        <tbody>
          {dataKecamatan.map((item, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="p-2 border">{item.kecamatan}</td>
              <td className="p-2 text-center border font-semibold text-blue-600">
                {item.total}
              </td>
              <td className="p-2 text-center border text-red-600">
                {item.meninggal}
              </td>
              <td className="p-2 text-center border text-yellow-600">
                {item.luka}
              </td>
              <td className="p-2 text-center border text-blue-600">
                {item.hilang}
              </td>
              <td className="p-2 text-center border text-green-600">
                {item.mengungsi}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</section>


          {/* ===================================================== */}
          {/*              B. INFORMASI RUMAH RUSAK                */}
          {/* ===================================================== */}

          <h2 className="text-xl font-bold text-gray-700 mt-10">
            B. Informasi Rumah Terdampak
          </h2>

          <section className="grid grid-cols-1 sm:grid-cols-4 gap-4"> {/* TOTAL */} 
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
                <RumahCard icon={<Home size={26} />} title="Rusak Ringan" value={dataKecamatan.reduce((a, b) => a + b.rusakringan, 0)} color="green" /> {/* RUSAK BERAT */} 
                <RumahCard icon={<Home size={26} />} title="Rusak Berat" value={dataKecamatan.reduce((a, b) => a + b.rusakberat, 0)} color="red" /> {/* HILANG/HANYUT */} 
                <RumahCard icon={<Home size={26} />} title="Hilang/Hanyut" value={dataKecamatan.reduce((a, b) => a + b.rumahhilang, 0)} color="yellow" /> 
          </section>

          {/* CARD RUMAH */}
         <section className="bg-white p-6 rounded-xl shadow">
  <h2 className="text-lg font-semibold mb-4">
    Distribusi Rumah Rusak Per Kecamatan
  </h2>

  {/* === WRAPPER RESPONSIVE === */}
  <div className="flex flex-col lg:flex-row gap-6">

    {/* ================= PIE CHART ================= */}
    <div className="w-full lg:w-1/2 h-[360px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={dataKecamatan
              .filter(
                (item) =>
                  item.rusakringan +
                    item.rumahhilang +
                    item.rusakberat >
                  0
              )
              .map((item) => ({
                name: item.kecamatan,
                value:
                  item.rusakringan +
                  item.rumahhilang +
                  item.rusakberat,
              }))}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={3}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={true}
          >
            {dataKecamatan.map((_, index) => (
              <Cell
                key={index}
                fill={`hsl(${(index * 40) % 360}, 70%, 55%)`}
              />
            ))}
          </Pie>

          {/* === CUSTOM TOOLTIP === */}
          <Tooltip
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const d = payload[0];

              return (
                <div className="bg-white p-3 rounded-lg shadow border text-sm">
                  <p className="font-semibold">{d.name}</p>
                  <p>Total: {d.value}</p>
                  <p className="text-gray-500">
                    {(d.percent * 100).toFixed(1)}%
                  </p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* ================= TABLE ================= */}
    <div className="w-full lg:w-1/2 overflow-y-auto border rounded-lg max-h-[360px]">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="p-2 text-left border">Kecamatan</th>
            <th className="p-2 text-center border">Rusak Ringan</th>
            <th className="p-2 text-center border">Rusak Berat</th>
            <th className="p-2 text-center border">Hilang/Hanyut</th>
            <th className="p-2 text-center border">Total Terdampak</th>
          </tr>
        </thead>

        <tbody>
            {dataKecamatan.map((item, i) => (

              
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{item.kecamatan}</td>
                  <td className="p-2 text-center border text-green-600">
                    {item.rusakringan}
                  </td>
                  <td className="p-2 text-center border text-red-600">
                    {item.rusakberat}
                  </td>
                  <td className="p-2 text-center border text-yellow-600">
                    {item.rumahhilang}
                  </td>
                  <td className="p-2 text-center border font-semibold">
                   {item.total = item.rusakringan + item.rusakberat + item.rumahhilang}
                  </td>
                </tr>
               ))}
        </tbody>
      </table>
    </div>

  </div>
</section>


        </main>
      </div>
    </div>
  );
}

/* ======================= SUB COMPONENT ====================== */

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

function Th({ children, center }: any) {
  return (
    <th
      className={`p-3 border-r border-gray-300 ${
        center ? "text-center" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({ children, center }: any) {
  return (
    <td
      className={`p-3 border-r border-gray-300 ${
        center ? "text-center" : "text-left"
      }`}
    >
      {children}
    </td>
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


const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  value,
}: any) => {
  const RADIAN = Math.PI / 180;

  const radius = outerRadius + 30; // jarak label dari pie
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      fontSize={13}
      fontWeight="600"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${name} (${value})`}
    </text>
  );
};



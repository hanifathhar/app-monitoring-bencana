"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Camera } from "lucide-react";

interface Props {
  onChangeKoordinat: (lat: string, lng: string) => void;
  onChangeFoto?: (url: string | null) => void;
}

export default function InputFotoDenganKoordinat({
  onChangeKoordinat,
  onChangeFoto,
}: Props) {
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<"lokasi" | "upload" | null>(null);

  const ambilLokasi = (): Promise<{ lat: string; lng: string }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Geolocation tidak didukung browser."));
      }

      setLoading("lokasi");

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latitude = pos.coords.latitude.toString();
          const longitude = pos.coords.longitude.toString();
          resolve({ lat: latitude, lng: longitude });
          setLoading(null);
        },
        (err) => {
          setLoading(null);
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const uploadFoto = async (file: File) => {
    try {
      setLoading("upload");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setLoading(null);

      if (res.ok && data.url) {
        onChangeFoto?.(data.url);
      } else {
        throw new Error("Upload gagal");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Gagal upload foto.");
      onChangeFoto?.(null);
      setLoading(null);
    }
  };

  const handleAmbilFoto = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview lokal dulu
    setFotoPreview(URL.createObjectURL(file));

    try {
      const { lat, lng } = await ambilLokasi();
      setLat(lat);
      setLng(lng);
      onChangeKoordinat(lat, lng);

      await uploadFoto(file);
    } catch (err) {
      alert("⚠️ Aktifkan GPS dan izinkan akses lokasi.");
      console.error(err);
    }
  };

  return (
    <Card className="p-4 shadow-md border border-gray-200 rounded-2xl">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          <label className="font-semibold text-sm">
            Ambil Foto (otomatis ambil lokasi)
          </label>
        </div>

        <Input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleAmbilFoto}
        />

        {fotoPreview && (
          <img
            src={fotoPreview}
            alt="Preview"
            className="w-full h-56 object-cover rounded-xl shadow-lg border border-gray-200"
          />
        )}

        {loading && (
          <div className="flex items-center text-gray-500 text-sm gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {loading === "lokasi"
              ? "Mengambil lokasi..."
              : "Mengunggah foto ke server..."}
          </div>
        )}

        {lat && lng && (
          <div className="flex items-center text-gray-700 text-sm gap-2 mt-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <p>
              <b>Koordinat:</b> {lat}, {lng}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

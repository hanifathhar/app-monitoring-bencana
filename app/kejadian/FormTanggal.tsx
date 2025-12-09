"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 📌 Validasi Zod
const FormSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
});

type FormType = z.infer<typeof FormSchema>;

export default function FormTanggal({ defaultValue }: { defaultValue?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tanggal: defaultValue || "",
    },
  });

  const [hasil, setHasil] = useState("");

  const formatIndonesia = (tgl: string) => {
    if (!tgl) return "";
    const d = new Date(tgl);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const onSubmit = (data: FormType) => {
    setHasil(formatIndonesia(data.tanggal));
  };

  return (
    <div className="p-4 max-w-md space-y-4 border rounded-lg">
      <h2 className="font-semibold text-lg">Form Input Tanggal</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Input Date */}
        <div>
          <label className="font-medium">Tanggal</label>
          <Input type="date" {...register("tanggal")} />

          {errors.tanggal && (
            <p className="text-red-600 text-sm">{errors.tanggal.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Kirim"}
        </Button>
      </form>

      {/* Hasil */}
      {hasil && (
        <div className="p-3 bg-gray-100 rounded-md">
          <p className="text-sm">
            <b>Tanggal Indonesia:</b> {hasil}
          </p>
        </div>
      )}
    </div>
  );
}

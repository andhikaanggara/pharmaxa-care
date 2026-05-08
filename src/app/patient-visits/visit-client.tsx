"use client";

import { useState } from "react";
import { ClipboardList, Plus, Search, Trash2, UserPlus } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { VisitsFormDialog } from "./_componenets/visits-from-dialog";

export default function VisitClient({ patientList, staffList, treatments }: any) {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className="mx-auto flex w-full flex-col gap-6 p-4 md:p-10">
      <SectionHeader
        title="Operasional Klinik"
        description="Data kunjungan dan transaksi hari ini."
        icon={ClipboardList}
        actionLabel="Registrasi Pasien"
        onAction={() => setIsOpen(true)}
      />

      {/* Stats Section (Revenue Ringkas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-sm text-blue-600 font-medium">Total Pasien</p>
          {/* <p className="text-2xl font-bold">{initialVisits.length}</p> */}
        </div>
        {/* Tambahkan stats lain di sini */}
      </div>

      {/* Tabel Kunjungan (Gunakan shell yang sama dengan Attendance) */}
      <div className="border rounded-xl overflow-hidden bg-background">
        {/* Render Map initialVisits di sini seperti di AttendanceClient */}
      </div>

      <VisitsFormDialog
        patientList={patientList}
        staffList={staffList}
        treatmentsList={treatments}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
}

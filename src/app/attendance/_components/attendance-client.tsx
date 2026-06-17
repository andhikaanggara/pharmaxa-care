"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Calendar, Edit3, Trash2 } from "lucide-react";

// UI Components
import { SectionHeader } from "@/components/section/section-header";
import { SectionTable, TableColumn } from "@/components/section/section-table";

// Actions & Types
import type { IRole } from "@/type/role";
import type { IStaff } from "@/type/staff";
import { AttendanceForm } from "./attendance-form";
import {
  AttendanceFormData,
  AttendanceSchema,
  GroupedAttendance,
} from "./schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateIndo } from "@/lib/utils/format";
import { ConfirmDeleteDialog } from "@/components/feedback/confirm-delete-dialog";
import { delleteAttendance } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AttendanceClient({
  initialAttendance,
  staffList,
  roles,
}: {
  initialAttendance: AttendanceSchema[];
  staffList: IStaff[];
  roles: IRole[];
}) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // --- UI States ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertDeleteOpen, setIsAlertDeleteOpen] = useState(false);
  const [isPendingDelete, startTransition] = useTransition();

  // --- Data States ---
  const [selected, setSelected] = useState<AttendanceFormData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GroupedAttendance | null>(
    null,
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- Memos & Helpers ---
  const staffMap = useMemo(
    () => new Map(staffList.map((s) => [s.id, s])),
    [staffList],
  );

  const groupedAttendance = useMemo(() => {
    const groups: Record<string, GroupedAttendance> = {};

    initialAttendance.forEach((item) => {
      // Kombinasi Tanggal dan Shift sebagai pengenal unik kelompok
      const groupKey = `${item.date}-${item.shift}`;

      // Jalur Logika 1: Jika kelompok belum ada di wadah, buat rumah barunya
      if (!groups[groupKey])
        groups[groupKey] = { id: groupKey, date: item.date, shift: item.shift };

      // Jalur Logika 2: Ambil informasi staff dari map
      const staffInfo = staffMap.get(item.staff_id);
      const roleName = staffInfo?.roles?.role_name;

      // Jalur Logika 3: Jika staff punya role, masukkan ke dalam kelompok
      if (staffInfo && roleName) {
        // Masukkan nama staff ke kolom rolenya (Misal: Apoteker = "Andi")
        groups[groupKey][roleName] = staffInfo.staff_name;
        // Masukkan ID staff untuk kebutuhan interaksi UI (Misal: id_Apoteker = 5)
        groups[groupKey][`id_${roleName}`] = item.staff_id;
      }
    });

    return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
  }, [initialAttendance, staffMap]);

  const HEADER: TableColumn<GroupedAttendance>[] = [
    {
      header: "Date",
      accessor: (d) => formatDateIndo(d.date),
    },
    {
      header: "Shift",
      accessor: (d) => d.shift,
    },
    ...roles.map((role) => ({
      header: role.role_name,
      accessor: (d: GroupedAttendance) => d[role.role_name] || "-",
    })),
  ];

  const handleOpenAdd = () => {
    setSelected(null);
    setIsFormOpen(true);
  };

  const handleEdit = (row: GroupedAttendance) => {
    const formData = {
      date: row.date,
      shift: row.shift,
      ...roles.reduce(
        (acc, role) => {
          acc[role.role_name] = row[`id_${role.role_name}`];
          return acc;
        },
        {} as Record<string, string>,
      ),
    };
    setSelected(formData);
    setIsFormOpen(true);
  };

  const handleDeleteTrigger = (att: GroupedAttendance) => {
    setDeleteTarget(att);
    setIsAlertDeleteOpen(true);
  };

  if (!isMounted) return null;

  return (
    <div className="mx-auto flex w-full flex-col gap-6 p-4 md:p-6 h-[calc(100vh-64px)] overflow-hidden">
      <SectionHeader
        title="Staff Attendance"
        description="Manage daily clinic attendance."
        icon={Calendar}
        actionLabel="Add attendance"
        onAction={handleOpenAdd}
      />

      <SectionTable
        data={groupedAttendance}
        header={HEADER}
        onEdit={handleEdit}
        onDelete={handleDeleteTrigger}
        mobileRender={(row: GroupedAttendance) => (
          <div
            key={row.id}
            className="bg-background rounded-xl shadow-sm space-y-3"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <div className="font-bold">{formatDateIndo(row.date)}</div>
              <Badge variant="secondary">{row.shift}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {roles.map(({ role_name }) => (
                <div key={role_name} className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase">
                    {role_name}
                  </span>
                  <span className="font-medium truncate">
                    {row[role_name] || "-"}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleEdit(row)}
              >
                <Edit3 className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  handleDeleteTrigger(row);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Hapus
              </Button>
            </div>
          </div>
        )}
      />

      {/* Form Dialog */}
      <AttendanceForm
        staffList={staffList}
        roles={roles.map((r) => r.role_name)}
        isDialogOpsOpen={isFormOpen}
        setIsDialogOpsOpen={setIsFormOpen}
        editing={selected}
      />

      {/* Delete Alert */}
      <ConfirmDeleteDialog
        isOpen={isAlertDeleteOpen}
        onOpenChange={setIsAlertDeleteOpen}
        entityName="Presensi"
        itemName={
          deleteTarget
            ? `${formatDateIndo(deleteTarget.date)} - Shift ${deleteTarget.shift}`
            : ""
        }
        isPending={isPendingDelete}
        onConfirm={() => {
          if (!deleteTarget) return;
          startTransition(async () => {
            const res = await delleteAttendance(
              deleteTarget.date,
              deleteTarget.shift,
            );
            if (res.error) {
              toast.error(res.error);
            } else {
              setIsAlertDeleteOpen(false);
              router.refresh();
              toast.success("Presensi berhasil dihapus");
            }
          });
        }}
      />
    </div>
  );
}

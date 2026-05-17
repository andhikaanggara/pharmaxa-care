"use client";

import { useEffect, useState, useTransition } from "react";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// UI Component
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Action
import { createPatientAndVisit } from "../actions";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { PatientFormSection } from "./form-section/patient-form-section";
import { VisitFormSection } from "./form-section/visit-form-section";
import { TreatmentFormSelection } from "./form-section/treatment-form-section";

export function VisitFormDialog({
  patientList,
  staffList,
  treatmentsList,
  setIsOpen,
  isOpen,
  editing,
}: any) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // --- State ---
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patients: {
        id: "",
        patient_name: "",
        mr_number: "",
        gender: "",
        birth_date: "",
        phone: "",
        address: "",
        isNewPatient: false,
      },
      // visits
      visits: {
        date: "",
        shift: "",
        patient_id: "",
        poly_destination: "Umum",
        recipe_type: "Biasa",
        total_amount: "",
        payment: "",
        payment_methode: "Cash",
        create_by: "",
      },
      // treatment
      treatments: [
        {
          visits_id: "",
          treatment_name_id: "",
          treatment_name: "",
          operation_staff_id: "",
          operation_staff: "",
          assistant_staff_id: "",
          assistant_staff: "",
        },
      ],
    },
  });

  const isNewPatient = watch("patients.isNewPatient");
  const [selectedCard, setSelectedCard] = useState(false);

  const handleSubmitPatient = async (data: any) => {
    startTransition(async () => {
      const playload = {
        ...data,
        isEdit: !!editing,
        visitId: editing?.visits?.id,
      };

      const res = await createPatientAndVisit(playload);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(
          editing ? "Data berhasil diperbarui" : "Data berhasil disimpan",
        );
        setIsOpen(false);
        reset();
        router.refresh();
      }
    });
  };

  // --- Helper ---
  const generateMRNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const nextNumber = (patientList.length + 1).toString().padStart(3, "0");
    return `${year}${month}${nextNumber}`;
  };

  const getShiftDefault = () => {
    const h = new Date().getHours();
    if (h >= 7 && h < 14) return "Pagi";
    if (h >= 14 && h < 21) return "Sore";
    return "Malam";
  };

  useEffect(() => {
    if (isNewPatient) {
      setValue("patients.mr_number", generateMRNumber());
    }
  }, [isNewPatient]);

  useEffect(() => {
    if (isOpen && editing) {
      console.log("Data yang mau diedit:", editing);
      reset({
        patients: {
          id: editing.patients.patient_id,
          patient_name: editing.patients.patient_name,
          mr_number: editing.patients.mr_number,
          gender: editing.patients.gender,
          birth_date: editing.patients.birth_date,
          phone: editing.patients.phone,
          address: editing.patients.address,
          isNewPatient: false,
        },
        visits: {
          ...editing.visits,
          date: editing.visits?.date
            ? format(new Date(editing.visits.date), "yyyy-MM-dd")
            : "",
          poly_destination: editing.patients.poly_destination,
        },
        treatments:
          editing.treatments?.length > 0
            ? editing.treatments
            : [
                {
                  visits_id: "",
                  treatment_name_id: "",
                  treatment_name: "",
                  operation_staff_id: "",
                  operation_staff: "",
                  assistant_staff_id: "",
                  assistant_staff: "",
                },
              ],
      });
      if (editing.patient_id) {
        setSelectedCard(true);
      } else if (isOpen && !editing) {
        reset({
          patients: { isNewPatient: false, patient_name: "" },
          visits: {
            date: format(new Date(), "yyyy-MM-dd"),
            shift: getShiftDefault(),
            poly_destination: "Umum",
            recipe_type: "Biasa",
            payment_methode: "Cash",
          },
          treatments: [{ treatment_name: "" }],
        });
        setSelectedCard(false);
      }
    }
  }, [isOpen, editing, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Kunjungan" : "Registrasi Kunjungan Baru"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Data Patient */}
          <form
            onSubmit={handleSubmit(handleSubmitPatient)}
            className="flex flex-col gap-4"
          >
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Patient Data
              </h3>
            </div>

            <PatientFormSection
              patientList={patientList}
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
              reset={reset}
              watch={watch}
              setValue={setValue}
              isNewPatient={isNewPatient}
              register={register}
              control={control}
            />

            {/* Visits */}
            <VisitFormSection control={control} />

            {/* Treatments */}
            <TreatmentFormSelection
              treatmentsList={treatmentsList}
              staffList={staffList}
              control={control}
              setValue={setValue}
              watch={watch}
            />

            <DialogFooter>
              <div className="mr-auto font-bold">
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="Rp. "
                  placeholder="Rp. 0"
                  value={watch("visits.total_amount")}
                />
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Menyimpan..."
                  : editing
                    ? "Perbarui Kunjungan"
                    : "Simpan Kunjungan"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

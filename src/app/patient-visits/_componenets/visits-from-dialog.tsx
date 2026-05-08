"use client";

import { useEffect, useState, useTransition } from "react";
import { NumericFormat, PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// UI Component
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, UserPlus } from "lucide-react";

// Action
import { createPatient } from "../actions";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateIndo } from "@/lib/utils/format";

export function VisitsFormDialog({
  patientList,
  staffList,
  treatmentsList,
  setIsOpen,
  isOpen,
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
      id: "",
      patient_name: "",
      mr_number: "",
      gender: "",
      birth_date: "",
      phone: "",
      address: "",
      isNewPatient: false,
    },
  });

  const isNewPatient = watch("isNewPatient");
  const isSelectPatient = watch("patient_name");
  const [selectedCard, setSelectedCard] = useState(false);

  const handleSubmitPatient = async (data: any) => {
    const fd = new FormData();
    Object.keys(data).forEach((key) => fd.append(key, data[key]));

    console.log(data);

    startTransition(async () => {
      const res = await createPatient(fd);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Pasien berhasil disimpan");
        reset();
        router.refresh();
      }
    });
  };

  const [visits, setVisits] = useState({
    date: "",
    shift: "",
    patient_id: "",
    poly_destination: "Umum",
    recipe_type: "Biasa",
    total_amount: "",
    payment: "",
    payment_methode: "",
    create_by: "",
  });

  const [visitTreatments, setVisitTreatments] = useState([
    {
      visits_id: "",
      treatment_name_id: "",
    },
  ]);

  // --- Helper ---
  const generateMRNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const nextNumber = (patientList.length + 1).toString().padStart(3, "0");
    return `${year}${month}${nextNumber}`;
  };

  useEffect(() => {
    if (isNewPatient) {
      setValue("mr_number", generateMRNumber());
    }
  }, [isNewPatient]);

  // --- Handler ---
  const addTreatmentRow = () =>
    setVisitTreatments([
      ...visitTreatments,
      {
        visits_id: "",
        treatment_name_id: "",
      },
    ]);

  const removeTreatmentRow = (index: number) => {
    setVisitTreatments(visitTreatments.filter((_, i) => i !== index));
  };

  const updateTreatment = (index: number, field: string, value: any) => {
    const newTs = [...visitTreatments];
    newTs[index] = { ...newTs[index], [field]: value };
    setVisitTreatments(newTs);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrasi Kunjungan Baru</DialogTitle>
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

            {selectedCard ? (
              <div className="p-4 border border-border bg-background rounded-xl shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="font-bold text-xl">
                    {getValues("patient_name")}
                  </div>
                  <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                    {getValues("mr_number")}
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-xm">
                  <div className="grid grid-cols-2">
                    <span className="font-medium truncate">
                      {getValues("gender")}
                    </span>
                    <span className="font-medium truncate">
                      {formatDateIndo(getValues("birth_date"))}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium ">{getValues("address")}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      (setSelectedCard(false), reset());
                    }}
                  >
                    Ganti Pasien
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* nama patient */}
                <div className="flex flex-col gap-1 ">
                  <Label>Cari Pasien</Label>
                  <Combobox items={patientList}>
                    <ComboboxInput
                      placeholder="Nama Sesuai KTP"
                      required
                      showClear
                      onChange={(e) => setValue("patient_name", e.target.value)}
                      value={isSelectPatient}
                    />
                    <ComboboxContent>
                      <ComboboxList>
                        <ComboboxGroup>
                          <ComboboxCollection>
                            {(item) => (
                              <ComboboxItem
                                key={item.id}
                                value={item.patient_name}
                                onClick={() => {
                                  setValue("id", item.id);
                                  setValue("patient_name", item.patient_name);
                                  setValue("birth_date", item.birth_date);
                                  setValue("gender", item.gender);
                                  setValue("mr_number", item.mr_number);
                                  setValue("address", item.address);
                                  setValue("isNewPatient", false);
                                  setSelectedCard(true);
                                }}
                              >
                                <Item size="xs" className="p-0 cursor-pointer">
                                  <ItemContent>
                                    <ItemTitle>{item.patient_name}</ItemTitle>
                                    <ItemDescription>
                                      {formatDateIndo(item.birth_date)}
                                    </ItemDescription>
                                    <ItemDescription className="line-clamp-1">
                                      {item.address}
                                    </ItemDescription>
                                  </ItemContent>
                                </Item>
                              </ComboboxItem>
                            )}
                          </ComboboxCollection>
                        </ComboboxGroup>
                        <ComboboxGroup>
                          <ComboboxItem className=" p-0 flex justify-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setValue("isNewPatient", true)}
                              className="text-xs cursor-pointer"
                            >
                              <UserPlus className="w-3 h-3 mr-1" />{" "}
                              {`Tambah Pasien ${isSelectPatient}`}
                            </Button>
                          </ComboboxItem>
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
                {/* input patient */}
                {isNewPatient && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-2 ">
                      {/* MR Number */}
                      <div className="flex flex-col gap-1">
                        <Label>Nomor RM</Label>
                        <Input {...register("mr_number")} readOnly />
                      </div>

                      {/* gender */}
                      <div className="flex flex-col gap-1">
                        <Label>Jenis Kelamin</Label>
                        <Controller
                          control={control}
                          name="gender"
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Jenis Kelamin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Laki-laki">
                                  Laki-laki
                                </SelectItem>
                                <SelectItem value="Perempuan">
                                  Perempuan
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Birth Date */}
                      <div className="flex flex-col gap-1">
                        <Label>Tanggal Lahir</Label>
                        <Input
                          type="date"
                          {...register("birth_date", { required: true })}
                        />
                      </div>

                      {/* No telf */}
                      <div className="flex flex-col gap-1">
                        <Label>Nomor HP</Label>
                        <Controller
                          control={control}
                          name="phone"
                          render={({ field }) => (
                            <PatternFormat
                              customInput={Input}
                              mask=""
                              format="#### #### ####"
                              placeholder="08..."
                              onValueChange={(v) => {
                                field.onChange(v.value);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>

                    {/* Alamat */}
                    <div className="flex flex-col gap-1 w-full">
                      <Label>Alamat</Label>
                      <Textarea required {...register("address")} />
                    </div>
                    <Button type="submit" className="cursor-pointer">
                      Simpan Pasien
                    </Button>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Visits */}
          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Visit Patient
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <Label>Poli Tujuan</Label>
                <Select defaultValue={visits.poly_destination}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Umum">Umum</SelectItem>
                    <SelectItem value="Gigi">Gigi</SelectItem>
                    <SelectItem value="Bidan">Kebidanan</SelectItem>
                    <SelectItem value="Apotek">Apotek</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Label>Jenis Resep</Label>
                <Select defaultValue={visits.recipe_type}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tidak_Ada">Tidak Ada</SelectItem>
                    <SelectItem value="Biasa">Biasa</SelectItem>
                    <SelectItem value="Racikan">Racikan</SelectItem>
                    <SelectItem value="Rujuakan">Rujukan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Treatments */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Tindakan Medis
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTreatmentRow}
              >
                <Plus className="h-4 w-4 mr-1" /> Tambah
              </Button>
            </div>

            {visitTreatments.map((t, idx) => (
              <div key={idx} className="flex gap-2 border-b pb-4">
                <div className="flex flex-col gap-2">
                  <Combobox items={treatmentsList}>
                    <ComboboxInput showClear placeholder="Nama Tindakan" />
                    <ComboboxContent className="pointer-events-auto">
                      <ComboboxList className="max-h-43 overflow-y-auto border rounded-md shadow-sm bg-popover">
                        {(item) => (
                          <ComboboxItem
                            key={item.id}
                            value={item.treatment_name}
                            onClick={() =>
                              updateTreatment(
                                idx,
                                "treatment_name_id",
                                item.treatment_name,
                              )
                            }
                          >
                            {item.treatment_name}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  <div className="flex gap-2">
                    <Combobox items={staffList}>
                      <ComboboxInput placeholder="Operator" showClear />
                      <ComboboxContent>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.id} value={item.full_name}>
                              {item.full_name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <Combobox items={staffList}>
                      <ComboboxInput placeholder="Asisten" showClear />
                      <ComboboxContent>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.id} value={item.full_name}>
                              {item.full_name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setVisitTreatments(
                      visitTreatments.filter((_, i) => i !== idx),
                    )
                  }
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          {/* Payments */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <Label>Total Bayar</Label>
              <NumericFormat
                customInput={Input}
                onChange={(e) =>
                  setVisits({ ...visits, total_amount: e.target.value })
                }
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp. "
                placeholder="Rp. 0"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Terbayar</Label>
              <NumericFormat
                customInput={Input}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp. "
                placeholder="Rp. 0"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Metode</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BPJS">BPJS</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Qris">Qris</SelectItem>
                  <SelectItem value="Trasfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <div className="mr-auto text-lg font-bold">
              Total:
              {visits.total_amount}
            </div>
            <Button type="submit" disabled={isPending}>
              Simpan Kunjungan
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

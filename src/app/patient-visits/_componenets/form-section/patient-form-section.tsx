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
import { formatDateIndo } from "@/lib/utils/format";
import { UserPlus } from "lucide-react";
import { Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";

export function PatientFormSection({
  patientList,
  selectedCard,
  setSelectedCard,
  reset,
  watch,
  setValue,
  isNewPatient,
  register,
  control,
}: any) {
  const isSelectPatient = watch("patients.patient_name");

  return (
    <section>
      {selectedCard ? (
        <div className="p-4 border border-border bg-background rounded-xl shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="font-bold text-xl">
              {watch("patients.patient_name")}
            </div>
            <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
              {watch("patients.mr_number")}
            </div>
          </div>
          <div className="flex flex-col gap-2 text-xm">
            <div className="grid grid-cols-2">
              <span className="font-medium truncate">
                {watch("patients.gender")}
              </span>
              <span className="font-medium truncate">
                {formatDateIndo(watch("patients.birth_date"))}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium ">{watch("patients.address")}</span>
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
                onChange={(e) =>
                  setValue("patients.patient_name", e.target.value)
                }
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
                            setValue("patients.id", item.id);
                            setValue(
                              "patients.patient_name",
                              item.patient_name,
                            );
                            setValue("patients.birth_date", item.birth_date);
                            setValue("patients.gender", item.gender);
                            setValue("patients.mr_number", item.mr_number);
                            setValue("patients.address", item.address);
                            setValue("patients.isNewPatient", false);
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
                        onClick={() => setValue("patients.isNewPatient", true)}
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
                  <Input {...register("patients.mr_number")} readOnly />
                </div>

                {/* gender */}
                <div className="flex flex-col gap-1">
                  <Label>Jenis Kelamin</Label>
                  <Controller
                    control={control}
                    name="patients.gender"
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
                          <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                          <SelectItem value="Perempuan">Perempuan</SelectItem>
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
                    {...register("patients.birth_date", {
                      required: true,
                    })}
                  />
                </div>

                {/* No telf */}
                <div className="flex flex-col gap-1">
                  <Label>Nomor HP</Label>
                  <Controller
                    control={control}
                    name="patients.phone"
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
                <Textarea required {...register("patients.address")} />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

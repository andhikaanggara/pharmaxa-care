import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";

export function TreatmentFormSelection({
  treatmentsList,
  staffList,
  control,
  setValue,
  watch,
}: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "treatments",
  });

  const [treatments, setTreatments] = useState(false);

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Tindakan Medis
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            treatments
              ? append({
                  visits_id: "",
                  treatment_name_id: "",
                  treatment_name: "",
                  operation_staff_id: "",
                  operation_staff: "",
                  assistant_staff_id: "",
                  assistant_staff: "",
                })
              : setTreatments(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> Tambah
        </Button>
      </div>

      {treatments ? (
        <div>
          {fields.map((t, idx) => (
            <div key={idx} className="flex gap-2 border-b pb-4">
              <div className="flex flex-col gap-2">
                <Combobox items={treatmentsList}>
                  <ComboboxInput
                    showClear
                    placeholder="Nama Tindakan"
                    onChange={(e) =>
                      setValue(
                        `treatments.${idx}.treatment_name_id`,
                        e.target.value,
                      )
                    }
                    value={watch(`treatments.${idx}.treatment_name`)}
                  />
                  <ComboboxContent className="pointer-events-auto">
                    <ComboboxList className="max-h-43 overflow-y-auto border rounded-md shadow-sm bg-popover">
                      {(item) => (
                        <ComboboxItem
                          key={item.id}
                          value={item.id}
                          onClick={() => {
                            setValue(
                              `treatments.${idx}.treatment_name_id`,
                              item.id,
                            );
                            setValue(
                              `treatments.${idx}.treatment_name`,
                              item.treatment_name,
                            );
                          }}
                        >
                          {item.treatment_name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>

                <div className="flex gap-2">
                  <Combobox items={staffList}>
                    <ComboboxInput
                      showClear
                      placeholder="Operator"
                      onChange={(e) =>
                        setValue(
                          `treatments.${idx}.operation_staff_id`,
                          e.target.value,
                        )
                      }
                      value={watch(`treatments.${idx}.operation_staff`)}
                    />
                    <ComboboxContent>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem
                            key={item.id}
                            value={item.id}
                            onClick={() => {
                              setValue(
                                `treatments.${idx}.operation_staff_id`,
                                item.id,
                              );
                              setValue(
                                `treatments.${idx}.operation_staff`,
                                item.full_name,
                              );
                            }}
                          >
                            {item.full_name}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  <Combobox items={staffList}>
                    <ComboboxInput
                      showClear
                      placeholder="Asisten"
                      onChange={(e) =>
                        setValue(
                          `treatments.${idx}.assistant_staff_id`,
                          e.target.value,
                        )
                      }
                      value={watch(`treatments.${idx}.assistant_staff`)}
                    />
                    <ComboboxContent>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem
                            key={item.id}
                            value={item.id}
                            onClick={() => {
                              setValue(
                                `treatments.${idx}.assistant_staff_id`,
                                item.id,
                              );
                              setValue(
                                `treatments.${idx}.assistant_staff`,
                                item.full_name,
                              );
                            }}
                          >
                            {item.full_name}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(idx)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </section>
  );
}

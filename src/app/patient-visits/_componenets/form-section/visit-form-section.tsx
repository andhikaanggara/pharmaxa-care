import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";

export function VisitFormSection({ control }: any) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Visit Patient
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {/* poly destination */}
        <div className="flex flex-col gap-1">
          <Label>Poli Tujuan</Label>
          <Select defaultValue="Umum">
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

        {/* recipe type */}
        <div className="flex flex-col gap-1">
          <Label>Jenis Resep</Label>
          <Select defaultValue="Biasa">
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
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Total Bayar</Label>
          <Controller
            control={control}
            name="visits.total_amount"
            render={({ field }) => (
              <NumericFormat
                customInput={Input}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp. "
                placeholder="Rp. 0"
                onValueChange={(v) => {
                  field.onChange(v.value);
                }}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Terbayar</Label>
          <Controller
            control={control}
            name="visits.payment"
            render={({ field }) => (
              <NumericFormat
                customInput={Input}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp. "
                placeholder="Rp. 0"
                onValueChange={(v) => {
                  field.onChange(v.value);
                }}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Metode</Label>
          <Controller
            control={control}
            name="visits.payment_methode"
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue defaultValue="Cash" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BPJS">BPJS</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Qris">Qris</SelectItem>
                  <SelectItem value="Trasfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </section>
  );
}

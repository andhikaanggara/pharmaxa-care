import { TableCell, TableRow } from "@/components/ui/table";
import { VisitTableShell } from "./visit-table-shell";
import { IVisits } from "@/type/visits";
import { formatDateIndo } from "@/lib/utils/format";

interface IProps {
  visitsList: IVisits[];
}

export function VisitListDesktop({ visitsList }: IProps) {
  return (
    <div className="hidden md:block overflow-auto h-full relative">
      <VisitTableShell>
        {visitsList.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={8}
              className="text-center text-muted-foreground h-32"
            >
              Belum ada data presensi.
            </TableCell>
          </TableRow>
        ) : (
          visitsList.map((row, i) => (
            <TableRow key={row.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{formatDateIndo(row.date)}</TableCell>
              <TableCell>{row.shift}</TableCell>
              <TableCell>{row.patients.patient_name}</TableCell>
              <TableCell>{row.poly_destination}</TableCell>
              <TableCell>{row.recipe_type}</TableCell>
              <TableCell>{row.total_amount}</TableCell>
              <TableCell>{row.payment_methode}</TableCell>
            </TableRow>
          ))
        )}
      </VisitTableShell>
    </div>
  );
}

import tableStyles from "@/components/ui/Table/table.module.css";

import Table from "@/components/ui/Table";
import { Pencil, Trash2 } from "lucide-react";
import type { Estate } from "@/server/db/schema";

type Props = {
  estates: Estate[];
  handleEdit: (estate: Estate) => void;
  handleDelete: (estate: Estate) => void;
};

export default function EstatesTable({ estates, handleEdit, handleDelete }: Props) {
  return (
    <Table headers={["UF", "Nome", "Ações"]} emptyMessage="Nenhum estado cadastrado.">
      {estates.map((estate) => (
        <tr key={estate.code} className={tableStyles.tableRow}>
          <td style={{ textAlign: "center" }}>{estate.code}</td>
          <td style={{ textAlign: "center" }}>{estate.name}</td>
          <td className={tableStyles.tableActions}>
            <button onClick={() => handleEdit(estate)} className={tableStyles.iconBtn}>
              <Pencil size={16} />
            </button>
            <button onClick={() => handleDelete(estate)} className={tableStyles.iconBtn}>
              <Trash2 size={16} />
            </button>
          </td>
        </tr>
      ))}
    </Table>
  );
}

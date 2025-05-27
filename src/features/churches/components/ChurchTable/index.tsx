import tableStyles from "@/components/ui/Table/table.module.css";

import Table from "@/components/ui/Table";
import { type Church } from "@/server/db/schema";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  churches: Church[];
  handleEdit: (church: Church) => void;
  handleDelete: (church: Church) => void;
};

export default function ChurchTable({ churches, handleDelete, handleEdit }: Props) {
  return (
    <Table headers={["ID", "Nome", "Email", "Contato", "Tel", "Ações"]} emptyMessage="Nenhuma igreja foi encontrada.">
      {churches.map((church) => (
        <tr key={church.id} className={tableStyles.tableRow}>
          <td style={{ textAlign: "center" }}>{church.id}</td>
          <td style={{ textAlign: "center" }}>{church.name}</td>
          <td style={{ textAlign: "center" }}>{church.email}</td>
          <td style={{ textAlign: "center" }}>{church.contactPerson}</td>
          <td style={{ textAlign: "center" }}>{church.phoneNumber}</td>
          <td className={tableStyles.tableActions}>
            <button onClick={() => handleEdit(church)} className={tableStyles.iconBtn}>
              <Pencil size={16} />
            </button>
            <button onClick={() => handleDelete(church)} className={tableStyles.iconBtn}>
              <Trash2 size={16} />
            </button>
          </td>
        </tr>
      ))}
    </Table>
  )
}

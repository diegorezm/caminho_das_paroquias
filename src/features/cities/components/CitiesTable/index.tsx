import tableStyles from "@/components/ui/Table/table.module.css";
import type { City } from "@/server/db/schema";

import Table from "@/components/ui/Table";
import { Pencil, Trash2 } from "lucide-react";


type Props = {
  cities: City[];
  handleEdit: (city: City) => void;
  handleDelete: (city: City) => void;
};

export default function CitiesTable({ cities, handleDelete, handleEdit }: Props) {
  return (<Table headers={["ID", "Nome", "Estado", "Ações"]} emptyMessage="Nenhuma cidade cadastrada.">
    {cities.map((city) => (
      <tr key={city.id} className={tableStyles.tableRow}>
        <td style={{ textAlign: "center" }}>{city.id}</td>
        <td style={{ textAlign: "center" }}>{city.name}</td>
        <td style={{ textAlign: "center" }}>{city.estateCode}</td>
        <td className={tableStyles.tableActions}>
          <button onClick={() => handleEdit(city)} className={tableStyles.iconBtn}>
            <Pencil size={16} />
          </button>
          <button onClick={() => handleDelete(city)} className={tableStyles.iconBtn}>
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
    ))}
  </Table>)
}

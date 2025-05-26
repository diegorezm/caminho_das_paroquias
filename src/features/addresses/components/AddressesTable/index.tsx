import tableStyles from "@/components/ui/Table/table.module.css";
import type { Address } from "@/server/db/schema";

import Table from "@/components/ui/Table";
import { Pencil, Trash2 } from "lucide-react";


type Props = {
  addresses: Address[];
  handleEdit: (address: Address) => void;
  handleDelete: (address: Address) => void;
};

export default function AddressTable({ addresses, handleDelete, handleEdit }: Props) {
  // TODO: Display the city
  return (<Table headers={["ID", "CEP", "Bairro", "Número", "Ações"]} emptyMessage="Nenhum estado cadastrado.">
    {addresses.map((address) => (
      <tr key={address.id} className={tableStyles.tableRow}>
        <td style={{ textAlign: "center" }}>{address.id}</td>
        <td style={{ textAlign: "center" }}>{address.zipCode}</td>
        <td style={{ textAlign: "center" }}>{address.neighborhood}</td>
        <td style={{ textAlign: "center" }}>{address.houseNumber}</td>
        {/* <td style={{ textAlign: "center" }}>{address.cityId}</td> */}
        <td className={tableStyles.tableActions}>
          <button onClick={() => handleEdit(address)} className={tableStyles.iconBtn}>
            <Pencil size={16} />
          </button>
          <button onClick={() => handleDelete(address)} className={tableStyles.iconBtn}>
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
    ))}
  </Table>)
}

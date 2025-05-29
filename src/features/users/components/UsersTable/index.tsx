import tableStyles from "@/components/ui/Table/table.module.css";

import type { UserSafe } from "@/server/db/schema";

import Table from "@/components/ui/Table";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  users: UserSafe[];
  handleEdit: (user: UserSafe) => void;
  handleDelete: (user: UserSafe) => void;
};

export default function UsersTable({ users, handleDelete, handleEdit }: Props) {
  return (
    <Table headers={["Nome", "Email", "Role", "Ações"]} emptyMessage="Sem usuários.">
      {users.map((user) => (
        <tr key={user.id} className={tableStyles.tableRow}>
          <td style={{ textAlign: "center" }}>{user.name}</td>
          <td style={{ textAlign: "center" }}>{user.email}</td>
          <td style={{ textAlign: "center" }}>{user.role}</td>
          <td className={tableStyles.tableActions}>
            <button onClick={() => handleEdit(user)} className={tableStyles.iconBtn}>
              <Pencil size={16} />
            </button>
            <button onClick={() => handleDelete(user)} className={tableStyles.iconBtn}>
              <Trash2 size={16} />
            </button>
          </td>
        </tr>
      ))}
    </Table >
  )
}

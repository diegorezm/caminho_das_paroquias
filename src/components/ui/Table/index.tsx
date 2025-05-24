import styles from "./table.module.css";

type TableProps = {
  headers: string[];
  children: React.ReactNode;
  emptyMessage?: string;
};

export default function Table({ headers, children, emptyMessage }: TableProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.tableHeader}>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {children ?? (
          <tr>
            <td colSpan={headers.length} style={{ textAlign: "center", padding: 12 }}>
              {emptyMessage ?? "Nenhum registro encontrado."}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

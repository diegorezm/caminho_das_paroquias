"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import styles from "./estates.module.css";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { Estate } from "@/server/db/schema";
import { getQueryClient } from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { getEstates } from "./actions";

export default function EstatesDashboard() {
  const queryClient = getQueryClient()
  const { data: estates, error: estatesError, isError: isEstatesError, isPending: isEstatesPending } = useQuery({ queryKey: ["estates"], queryFn: getEstates })

  const [form, setForm] = useState({ code: "", name: "" });
  const [editing, setEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();
  };

  const resetForm = () => {
    setForm({ code: "", name: "" });
    setEditing(false);
  };

  const handleEdit = (estate: Estate) => {
    setForm(estate);
    setEditing(true);
  };


  return (
    <div className={styles.container}>
      <h1>Estados</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formField}>
          <Input
            type="text"
            placeholder="Código (UF)"
            maxLength={2}
            required
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
          />

        </div>
        <div className={styles.formField}>
          <Input
            type="text"
            placeholder="Nome do estado"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <Button type="submit" size="lg">
            {editing ? "Salvar edição" : "Criar"}
          </Button>
        </div>
        {editing && (
          <Button type="button" onClick={resetForm} variant="outline">
            Cancelar
          </Button>
        )}
      </form>

      {isEstatesError && <span>Error: {estatesError.message}</span>}

      {estatesError === null && !isEstatesPending && (
        <table className={styles.table}>
          <thead >
            <tr className={styles.tableHeader}>
              <th>UF</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {estates.map((estate) => (
              <tr key={estate.code} className={styles.tableRow}>
                <td style={{
                  textAlign: "center"
                }}>{estate.code}</td>
                <td style={{
                  textAlign: "center"
                }}>{estate.name}</td>
                <td className={styles.tableActions}>
                  <button onClick={() => handleEdit(estate)} className={styles.iconBtn}>
                    <Pencil size={16} />
                  </button>
                  <button
                    className={styles.iconBtn}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

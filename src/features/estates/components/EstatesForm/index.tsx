import styles from "./estateform.module.css"

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { type EstateInsert } from "@/server/db/schema";

type Props = {
  action: (payload: FormData) => void;
  values: EstateInsert;
  setValues: (values: EstateInsert) => void
  pending?: boolean;
  initialValues?: EstateInsert;
  editing?: boolean;
  resetForm?: VoidFunction
}

export default function EstatesForm({ action, values, setValues, editing = false, resetForm, pending = false }: Props) {
  return (
    <form action={action} className={styles.form}>
      <div className={styles.formField}>
        <Input
          type="text"
          placeholder="Código (UF)"
          maxLength={2}
          value={values.code}
          onChange={(e) => setValues({ ...values, code: e.target.value.toUpperCase() })}
          name="code"
          style={{
            textTransform: "uppercase"
          }}
          required
        />

      </div>
      <div className={styles.formField}>
        <Input
          type="text"
          placeholder="Nome do estado"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          name="name"
          required
        />

      </div>
      <div>
        <Button type="submit" size="lg" disabled={pending}>
          {editing ? "Salvar edição" : "Criar"}
        </Button>
      </div>
      {editing && (
        <Button type="button" onClick={resetForm} variant="outline">
          Cancelar
        </Button>
      )}
    </form>

  )
}

import styles from "./cities.form.module.css"
import { useQuery } from "@tanstack/react-query";
import { findAllEstates } from "@/features/estates/actions";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select, { type SelectOption } from "@/components/ui/Select";

import type { City } from "@/server/db/schema";

type Props = {
  action: (payload: FormData) => void;
  values: City;
  setValues: (values: City) => void;
  pending?: boolean;
  editing?: boolean;
  resetForm?: VoidFunction
}

export default function CitiesForm({ action, values, setValues, editing = false, resetForm, pending = false }: Props) {
  const { data: estates, error: estatesError, isError: isEstatesError, isPending: isEstatesPending } = useQuery({
    queryFn: findAllEstates,
    queryKey: ["estates"]
  })

  const estateOptions: SelectOption[] = (estates ?? []).map(estate => ({
    value: estate.code,
    label: estate.name,
  }));

  return (
    <form action={action} className={styles.form}>
      <div className={styles.formField}>
        <Input
          type="text"
          placeholder="Nome"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          minLength={2}
          maxLength={256}
          name="name"
          required
        />
      </div>
      <div className={styles.formField}>
        {isEstatesPending ? (
          <Input type="text" placeholder="Carregando estados..." disabled />
        ) : isEstatesError ? (
          <Input type="text" placeholder={`Erro ao carregar estados: ${estatesError?.message}`} disabled />
        ) : (
          <Select
            name="estate"
            options={estateOptions}
            value={values.estateCode}
            onChange={(e) => setValues({ ...values, estateCode: e.target.value })}
            placeholder="Selecione o Estado"
            required
            sizing="sm"
            disabled={pending}
          />
        )}
      </div>

      <input type="number" name="cityId" defaultValue={values.id} hidden disabled />

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

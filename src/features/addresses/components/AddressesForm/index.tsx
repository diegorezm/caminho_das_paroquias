import styles from "./address.form.module.css"
import { useQuery } from "@tanstack/react-query";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select, { type SelectOption } from "@/components/ui/Select";

import { Form, FormField } from "@/components/ui/Form";

import { type Address } from "@/server/db/schema";
import { getFieldError, type ActionState } from "@/lib/action-state";
import { findAllCities } from "@/features/cities/actions";

type Props = {
  action: (payload: FormData) => void
  state: ActionState | null
  initialValues?: Address
  pending?: boolean
  onCancel?: VoidFunction
}

export default function AddressForm({ action, state, initialValues, pending, onCancel }: Props) {
  const { data: cities, error: citiesError, isError: isCitiesError, isPending: isCitiesPending } = useQuery(({
    queryFn: async () => await findAllCities({}),
    queryKey: ["cities"]
  }))

  const citiesOptions: SelectOption[] = (cities?.data ?? []).map(city => ({
    label: city.name,
    value: city.id.toString()
  }))

  return (
    <Form action={action}>
      {initialValues !== undefined && (
        <input type="number" defaultValue={initialValues.id} name="id" hidden />
      )}
      <FormField
        label="CEP"
        error={getFieldError(state, "zipCode")}
      >
        <Input
          id="zipCode"
          name="zipCode"
          type="text"
          placeholder="00000-000"
          maxLength={9}
          minLength={9}
          required
          defaultValue={initialValues?.zipCode ?? ""}
        />
      </FormField>

      <FormField
        label="Rua"
        error={getFieldError(state, "street")}
      >
        <Input
          id="street"
          name="street"
          minLength={2}
          maxLength={256}
          type="text"
          required
          defaultValue={initialValues?.street ?? ""}
        />
      </FormField>

      <FormField
        label="Bairro"
        error={getFieldError(state, "neighborhood")}
      >
        <Input
          id="neighborhood"
          name="neighborhood"
          minLength={2}
          maxLength={256}
          required
          type="text"
          defaultValue={initialValues?.neighborhood ?? ""}
        />
      </FormField>

      <FormField
        label="Número"
        error={getFieldError(state, "houseNumber")}
      >
        <Input
          id="houseNumber"
          name="houseNumber"
          minLength={2}
          maxLength={256}
          required
          type="text"
          defaultValue={initialValues?.houseNumber ?? ""}
        />
      </FormField>

      <FormField label="Cidade">
        {isCitiesPending ? (
          <Input type="text" placeholder="Carregando cidades..." disabled />
        ) : isCitiesError ? (
          <Input type="text" placeholder={`Erro ao carregar cidades: ${citiesError?.message}`} disabled />
        ) : (
          <Select
            name="cityId"
            options={citiesOptions}
            defaultValue={initialValues?.cityId ?? ""}
            placeholder="Selecione uma cidade"
            required
            sizing="md"
            disabled={pending}
          />
        )}
      </FormField>

      <div className={styles.formActions}>
        <Button disabled={pending}>Salvar</Button>
        <Button type="button" onClick={onCancel} variant="outline">
          Cancelar
        </Button>
      </div>
      {getFieldError(state, "general")}
    </Form>
  )
}

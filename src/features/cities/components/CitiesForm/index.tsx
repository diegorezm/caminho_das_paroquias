import { useQuery } from "@tanstack/react-query";
import { findAllEstates } from "@/features/estates/actions";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select, { type SelectOption } from "@/components/ui/Select";
import { Form, FormActions, FormField } from "@/components/ui/Form";

import type { City } from "@/server/db/schema";
import { getFieldError, type ActionState } from "@/lib/action-state";

type Props = {
  action: (payload: FormData) => void;
  state: ActionState | null;
  initialValues?: City;
  pending?: boolean;
  onCancel?: VoidFunction;
};

export default function CitiesForm({
  action,
  state,
  initialValues,
  onCancel,
  pending = false,
}: Props) {
  const {
    data: estates,
    error: estatesError,
    isError: isEstatesError,
    isPending: isEstatesPending,
  } = useQuery({
    queryFn: async () => {
      return await findAllEstates({ limit: 20 });
    },
    queryKey: ["estates"],
  });

  const estateOptions: SelectOption[] = (estates?.data ?? []).map((estate) => ({
    value: estate.code,
    label: estate.name,
  }));

  return (
    <Form action={action}>
      {initialValues?.id && (
        <input type="hidden" name="id" defaultValue={initialValues.id} />
      )}

      <FormField label="Nome" htmlFor="name" error={getFieldError(state, "name")}>
        <Input
          type="text"
          placeholder="Nome"
          defaultValue={initialValues?.name ?? ""}
          minLength={2}
          maxLength={256}
          name="name"
          id="name"
          required
          disabled={pending}
        />
      </FormField>

      <FormField label="Estado" htmlFor="estateSelect" error={getFieldError(state, "estate")}>
        {isEstatesPending ? (
          <Input type="text" placeholder="Carregando estados..." disabled />
        ) : isEstatesError ? (
          <Input type="text" placeholder={`Erro ao carregar estados: ${estatesError?.message}`} disabled />
        ) : (
          <Select
            name="estate"
            options={estateOptions}
            // Use defaultValue for uncontrolled inputs
            defaultValue={initialValues?.estateCode ?? ""}
            placeholder="Selecione o Estado"
            required
            sizing="md"
            disabled={pending}
            id="estateSelect"
          />
        )}
      </FormField>

      <FormActions>
        <Button type="submit" size="lg" disabled={pending}>
          {initialValues ? "Salvar edição" : "Criar"}
        </Button>
        <Button type="button" onClick={onCancel} variant="outline" disabled={pending}>
          Cancelar
        </Button>
      </FormActions>
    </Form>
  );
}

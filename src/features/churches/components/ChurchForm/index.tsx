import Select, { type SelectOption } from "@/components/ui/Select";

import { getFieldError, type ActionState } from "@/lib/action-state";

import { findAllAddresses } from "@/features/addresses/actions";
import { useQuery } from "@tanstack/react-query";

import { Form, FormActions, FormField } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { type Church } from "@/server/db/schema";

type Props = {
  action: (payload: FormData) => void
  state: ActionState | null
  initialValues?: Church
  pending?: boolean
  onCancel?: VoidFunction
}

export default function ChurchForm({ action, state, initialValues, pending, onCancel }: Props) {
  const { data: addresses, error: addressesError, isError: isAddressesError, isPending: isAddressesPending } = useQuery({
    queryFn: async () => await findAllAddresses({}),
    queryKey: ["addresses"]
  })


  const addressesOptions: SelectOption[] = (addresses?.data ?? []).map((address) => ({
    label: `${address.street}, ${address.houseNumber} - ${address.neighborhood}, ${address.zipCode}`,
    value: address.id.toString(),
  }));

  return (
    <Form action={action}>
      {initialValues?.id && (
        <input type="hidden" name="id" value={initialValues.id} />
      )}

      <FormField label="Nome" error={getFieldError(state, "name")}>
        <Input
          type="text"
          name="name"
          id="name"
          minLength={1}
          maxLength={256}
          defaultValue={initialValues?.name ?? ""}
          required
          placeholder="Nome da igreja"
          disabled={pending}
        />
      </FormField>

      <FormField label="Pessoa de Contato" error={getFieldError(state, "contactPerson")}>
        <Input
          type="text"
          name="contactPerson"
          id="contactPerson"
          maxLength={256}
          defaultValue={initialValues?.contactPerson ?? ""}
          placeholder="Nome da pessoa de contato"
          disabled={pending}
        />
      </FormField>

      <FormField label="Email" error={getFieldError(state, "email")}>
        <Input
          type="email"
          name="email"
          id="email"
          maxLength={256}
          defaultValue={initialValues?.email ?? ""}
          placeholder="email@exemplo.com"
          disabled={pending}
        />
      </FormField>

      <FormField label="Telefone" error={getFieldError(state, "phoneNumber")}>
        <Input
          type="tel"
          name="phoneNumber"
          id="phoneNumber"
          maxLength={15}
          defaultValue={initialValues?.phoneNumber ?? ""}
          placeholder="(XX) XXXXX-XXXX"
          disabled={pending}
        />
      </FormField>

      <FormField label="Endereço" error={getFieldError(state, "addressId")}>
        {isAddressesPending ? (
          <Input type="text" placeholder="Carregando endereços..." disabled />
        ) : isAddressesError ? (
          <Input
            type="text"
            placeholder={`Erro ao carregar endereços: ${addressesError?.message}`}
            disabled
          />
        ) : (
          <Select
            name="addressId"
            options={addressesOptions}
            defaultValue={initialValues?.addressId?.toString() ?? ""}
            placeholder="Selecione um endereço"
            required
            sizing="md"
            disabled={pending}
          />
        )}
      </FormField>

      <FormActions>
        <Button type="submit" disabled={pending}>
          Salvar
        </Button>

        <Button type="button" onClick={onCancel} variant="outline" disabled={pending}>
          Cancelar
        </Button>
      </FormActions>
    </Form>
  );
}



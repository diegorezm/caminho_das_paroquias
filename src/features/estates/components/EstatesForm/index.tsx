import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import type { Estate } from "@/server/db/schema";
import { Form, FormActions, FormField } from "@/components/ui/Form";
import { getFieldError, type ActionState } from "@/lib/action-state";

type Props = {
  action: (payload: FormData) => void;
  state: ActionState | null;
  pending?: boolean;
  initialValues?: Estate;
  onCancel?: VoidFunction;
};

export default function EstatesForm({
  action,
  state,
  onCancel,
  pending = false,
  initialValues,
}: Props) {
  return (
    <Form action={action}>
      <FormField label="Código (UF)" htmlFor="code" error={getFieldError(state, "code")}>
        <Input
          type="text"
          placeholder="ex. SP"
          id="code"
          maxLength={2}
          defaultValue={initialValues?.code ?? ""}
          name="code"
          style={{
            textTransform: "uppercase",
          }}
          required
          disabled={pending}
        />
      </FormField>

      <FormField label="Nome do estado" htmlFor="name" error={getFieldError(state, "name")}>
        <Input
          type="text"
          placeholder="ex. São Paulo"
          // Use defaultValue for uncontrolled inputs
          defaultValue={initialValues?.name ?? ""}
          name="name"
          id="name"
          required
          disabled={pending}
        />
      </FormField>

      <FormActions>
        <Button type="submit" size="lg" disabled={pending}>
          {initialValues !== undefined ? "Salvar edição" : "Criar"}
        </Button>
        <Button type="button" onClick={onCancel} variant="outline" disabled={pending}>
          Cancelar
        </Button>
      </FormActions>
    </Form>
  );
}

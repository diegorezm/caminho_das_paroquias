import type { SelectOption } from "@/components/ui/Select"
import { getFieldError, type ActionState } from "@/lib/action-state"
import { userRoles, type UserSafe } from "@/server/db/schema"
import { Form, FormActions, FormField } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

type Props = {
  action: (payload: FormData) => void
  state: ActionState | null
  initialValues?: UserSafe
  pending?: boolean
  onCancel?: VoidFunction
}

export default function UsersForm({ action, state, initialValues, pending, onCancel }: Props) {
  const rolesOptions: SelectOption[] = userRoles.enumValues.map((role) => ({
    label: role,
    value: role
  }))
  return (
    <Form action={action}>
      {initialValues?.id && (
        <input type="hidden" name="id" value={initialValues.id} />
      )}

      <FormField label="Nome" htmlFor="name" error={getFieldError(state, "name")}>
        <Input
          type="text"
          name="name"
          id="name"
          minLength={1}
          maxLength={256}
          defaultValue={initialValues?.name ?? ""}
          required
          placeholder="Nome"
          disabled={pending}
        />
      </FormField>
      <FormField label="Email" htmlFor="email" error={getFieldError(state, "email")}>
        <Input
          type="email"
          name="email"
          id="email"
          defaultValue={initialValues?.email ?? ""}
          required
          placeholder="Email"
          disabled={pending}
        />
      </FormField>

      {initialValues === undefined &&
        (
          <FormField label="Senha" error={getFieldError(state, "password")}>
            <Input
              type="password"
              name="password"
              id="password"
              minLength={6}
              maxLength={256}
              required
              placeholder="Senha"
              disabled={pending}
            />
          </FormField>
        )
      }

      <FormField label="Cargo" error={getFieldError(state, "role")}>
        <Select
          name="role"
          options={rolesOptions}
          defaultValue={initialValues?.role ?? ""}
          placeholder="Selecione um cargo"
          required
          sizing="md"
          disabled={pending}
        />
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
  )
}

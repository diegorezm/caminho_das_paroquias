"use client"

import { useActionState, useEffect } from "react"
import { handleLogin } from "../../actions"

import { Form, FormError, FormField } from "@/components/ui/Form"

import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

import { getFieldError } from "@/lib/action-state"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [state, action, pending] = useActionState(handleLogin, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.status === "success") {
      router.push("/dashboard")
    }
  }, [state, router])

  return (
    <Form action={action}>
      <FormField label="Email" error={getFieldError(state, "email")}>
        <Input placeholder="example@email.com" type="email" name="email" />
      </FormField>
      <FormField label="Senha" error={getFieldError(state, "password")}>
        <Input placeholder="******" minLength={6} maxLength={128} name="password" type="password" required />
      </FormField>
      {state?.status === "error" && (
        <FormError state={state} />
      )}
      <div>
        <Button size="lg" disabled={pending}>
          Enviar
        </Button>
      </div>
    </Form>
  )
}

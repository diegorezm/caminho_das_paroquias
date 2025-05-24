"use server"
import type { ActionState } from "@/lib/action-state"
import { login } from "@/lib/auth"
import { ERROR_MESSAGES_PT_BR, PublicError } from "@/lib/errors"
import { tryCatch } from "@/lib/try_catch"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128)
})


export async function handleLogin(_prevState: unknown, formData: FormData): Promise<ActionState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = loginSchema.safeParse(rawData)

  if (!parsed.success) {
    return {
      status: "error",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const { email, password } = parsed.data

  const result = await tryCatch(login({ email, password }))
  if (result.error) {
    return {
      status: "error",
      errors: {
        general: [result.error.message]
      }
    }
  }
  return {
    status: "success"
  }
}


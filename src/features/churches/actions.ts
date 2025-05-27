"use server"

import { z } from "zod"

import { getSession } from "@/lib/auth"
import { tryCatch } from "@/lib/try_catch"

import { type ActionState } from "@/lib/action-state"
import { ERROR_MESSAGES_PT_BR, PublicError } from "@/lib/errors"

import { CHURCH_REPOSITORY } from "@/server/data_access/churches"

export async function findAllChurches() {
  if (await getSession() === undefined) {
    throw new PublicError(ERROR_MESSAGES_PT_BR.unauthorized)
  }
  return CHURCH_REPOSITORY.findAll()
}

const churchSchema = z.object({
  name: z.string()
    .min(1, "Nome da igreja é obrigatório")
    .max(256, "Nome deve ter no máximo 256 caracteres"),
  contactPerson: z.string()
    .max(256, "Nome do contato deve ter no máximo 256 caracteres")
    .optional(),
  email: z.string()
    .email("Formato de e-mail inválido")
    .max(256, "E-mail deve ter no máximo 256 caracteres")
    .optional(),
  phoneNumber: z.string()
    .max(15, "Número de telefone deve ter no máximo 15 caracteres")
    .optional(),
  addressId: z.coerce
    .number()
    .int("ID do endereço deve ser um número inteiro")
    .positive("ID do endereço deve ser um número positivo")
    .min(1, "ID do endereço é obrigatório"),
});

function parseFormData(formData: FormData) {
  const result = churchSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      errors: fieldErrors
    };
  }
  return result.data
}

export async function createChurch(_prevState: unknown, formData: FormData): Promise<ActionState> {
  if (await getSession() === undefined) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.unauthorized]
      }
    }
  }

  const parsedFormData = parseFormData(formData)

  if ("errors" in parsedFormData) {
    return {
      status: "error",
      errors: parsedFormData.errors,
    }
  }

  const result = await tryCatch(CHURCH_REPOSITORY.create(parsedFormData))

  if (result.error) {
    return {
      status: "error",
      errors: {
        general: [result.error.message]
      }
    }
  }

  return { status: "success" }
}

export async function updateChurch(_prevState: unknown, formData: FormData): Promise<ActionState> {
  if (await getSession() === undefined) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.unauthorized]
      }
    }
  }

  const parsedFormData = parseFormData(formData)

  if ("errors" in parsedFormData) {
    return {
      status: "error",
      errors: parsedFormData.errors,
    }
  }

  const id = Number(formData.get("id"))

  if (isNaN(id)) {
    return {
      status: "error",
      errors: {
        general: ["ID inválido"]
      }
    }
  }

  const result = await tryCatch(CHURCH_REPOSITORY.update(id, parsedFormData))

  if (result.error) {
    return {
      status: "error",
      errors: {
        general: [result.error.message]
      }
    }
  }

  return { status: "success" }
}


export async function deleteChurch(id: number): Promise<ActionState> {
  if (await getSession() === undefined) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.unauthorized]
      }
    }
  }

  const result = await tryCatch(CHURCH_REPOSITORY.remove(id))

  if (result.error) {
    return {
      status: "error",
      errors: {
        general: [result.error.message]
      }
    }
  }

  return { status: "success" }

}

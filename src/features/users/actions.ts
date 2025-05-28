"use server"

import { z } from "zod";

import { type ActionState } from "@/lib/action-state";
import { getSession } from "@/lib/auth";
import { ERROR_MESSAGES_PT_BR, PublicError } from "@/lib/errors";
import { tryCatch } from "@/lib/try_catch";

import type { PaginatedAction } from "@/types/paginated-action";

import { USERS_REPOSITORY } from "@/server/data_access/users";


export async function findAllUsers({ limit = 10, page = 1, q }: PaginatedAction) {
  const session = await getSession()

  if (!session || session.user.role !== "ADMIN") {
    throw new PublicError(ERROR_MESSAGES_PT_BR.unauthorized)
  }

  const result = await tryCatch(USERS_REPOSITORY.findAll({ limit, page, q }))

  if (result.error) {
    throw result.error
  }

  return result.data
}


const usersSchema = z.object({
  name: z
    .string({
      required_error: "O nome é obrigatório.",
      invalid_type_error: "O nome deve ser um texto.",
    })
    .min(1, "O nome não pode estar vazio.")
    .max(256, "O nome deve ter no máximo 256 caracteres."),

  email: z
    .string({
      required_error: "O e-mail é obrigatório.",
      invalid_type_error: "O e-mail deve ser um texto.",
    })
    .email("Formato de e-mail inválido.")
    .max(256, "O e-mail deve ter no máximo 256 caracteres."),

  password: z
    .string({
      required_error: "A senha é obrigatória.",
      invalid_type_error: "A senha deve ser um texto.",
    })
    .min(6, "A senha deve ter no mínimo 6 caracteres."),

  role: z.enum(["ADMIN", "USER"], {
    required_error: "O papel do usuário é obrigatório.",
    invalid_type_error: "O papel do usuário deve ser 'ADMIN' ou 'USER'.",
  }),
});

function parseFormData(formData: FormData) {
  const result = usersSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      errors: fieldErrors
    };
  }
  return result.data
}


export async function createUser(_preState: unknown, formData: FormData): Promise<ActionState> {
  const session = await getSession()

  if (!session || session.user.role !== "ADMIN") {
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

  const result = await tryCatch(USERS_REPOSITORY.create(parsedFormData))
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

export async function updateUser(_preState: unknown, formData: FormData): Promise<ActionState> {
  const session = await getSession()

  if (!session || session.user.role !== "ADMIN") {
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

  const id = formData.get("id")

  if (!id || typeof id !== "string") {
    return {
      status: "error",
      errors: {
        general: ["ID inválido"]
      }
    }
  }

  const result = await tryCatch(USERS_REPOSITORY.update(id, parsedFormData))
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


export async function deleteUser(id: string): Promise<ActionState> {
  const session = await getSession()

  if (!session || session.user.role !== "ADMIN") {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.unauthorized]
      }
    }
  }

  const result = await tryCatch(USERS_REPOSITORY.delete(id))
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

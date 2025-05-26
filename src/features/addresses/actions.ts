"use server"

import { z } from "zod"

import { getSession } from "@/lib/auth"

import { ERROR_MESSAGES_PT_BR, PublicError } from "@/lib/errors"
import { ADDRESS_REPOSITORY } from "@/server/data_access/address"

import { tryCatch } from "@/lib/try_catch"

import type { ActionState } from "@/lib/action-state"

export async function findAllAddresses() {
  if (await getSession() === undefined) {
    throw new PublicError(ERROR_MESSAGES_PT_BR.unauthorized)
  }
  return ADDRESS_REPOSITORY.findAll()
}

const addressSchema = z.object({
  zipCode: z.string()
    .min(1, "CEP é obrigatório")
    .length(9, "CEP deve ter 8 dígitos (ex: 12345-678)")
    .regex(/^\d{5}-\d{3}$/, "Formato de CEP inválido (ex: 12345-678)"),

  street: z.string()
    .min(2, "Rua deve ter no mínimo 2 caracteres")
    .max(256, "Rua deve ter no máximo 256 caracteres"),

  neighborhood: z.string()
    .min(2, "Bairro deve ter no mínimo 2 caracteres")
    .max(256, "Bairro deve ter no máximo 256 caracteres"),

  houseNumber: z.string()
    .min(1, "Número da casa é obrigatório")
    .max(6, "Número da casa deve ter no máximo 6 caracteres"),

  cityId: z.coerce.number()
    .int("ID da cidade deve ser um número inteiro")
    .positive("ID da cidade deve ser um número positivo")
    .min(1, "Cidade é obrigatória"),
});

function parseFormData(formData: FormData) {
  const result = addressSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      errors: fieldErrors
    };
  }
  return result.data
}


export async function createAddress(_prevState: unknown, formData: FormData): Promise<ActionState> {
  if (await getSession() === undefined) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.unauthorized]
      }
    }
  }

  const validationResult = parseFormData(formData)
  if ("errors" in validationResult) {
    return {
      status: "error",
      errors: validationResult.errors
    }
  }

  const address = validationResult

  // TODO:  check if city exists

  const result = await tryCatch(ADDRESS_REPOSITORY.create(address))

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


export async function updateAddress(_prevState: unknown, formData: FormData): Promise<ActionState> {
  if (await getSession() === undefined) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.unauthorized]
      }
    }
  }

  const idRaw = formData.get("id")
  if (!idRaw || typeof idRaw !== "string") {
    console.log(idRaw)
    return {
      status: "error",
      errors: {
        general: ["ID inválido"]
      }
    }
  }

  const id = parseInt(idRaw)

  if (isNaN(id)) {
    return {
      status: "error",
      errors: {
        general: ["ID inválido"]
      }
    }
  }

  const validationResult = parseFormData(formData)
  if ("errors" in validationResult) {
    return {
      status: "error",
      errors: validationResult.errors
    }
  }

  const address = validationResult

  // TODO:  check if city exists

  const result = await tryCatch(ADDRESS_REPOSITORY.update(id, address))

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

export async function deleteAddress(id: number): Promise<ActionState> {
  if (await getSession() === undefined) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.unauthorized]
      }
    }
  }

  const result = await tryCatch(ADDRESS_REPOSITORY.delete(id))

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

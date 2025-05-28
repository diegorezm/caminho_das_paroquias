"use server"

import { z } from "zod"

import { getSession } from "@/lib/auth"
import { ERROR_MESSAGES_PT_BR, PublicError } from "@/lib/errors"
import { tryCatch } from "@/lib/try_catch"

import { ESTATES_REPOSITORY } from "@/server/data_access/estates"

import type { ActionState } from "@/lib/action-state"
import type { EstateInsert } from "@/server/db/schema"
import type { PaginatedAction } from "@/types/paginated-action"

export async function findAllEstates({ limit = 10, page = 1, q }: PaginatedAction) {
  if (await getSession() !== undefined) {
    const { data, error } = await tryCatch(ESTATES_REPOSITORY.findAll({ limit, page, q }))

    if (error) {
      throw error
    }

    return data
  }
  throw new PublicError(ERROR_MESSAGES_PT_BR.unauthorized)
}

const createEstateSchema = z.object({
  code: z.string().min(2).max(2),
  name: z.string().min(2).max(256)
})

export async function createEstate(_prevState: unknown, formData: FormData): Promise<ActionState> {
  if (await getSession() === undefined) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.unauthorized]
      }
    }
  }

  const validatedFields = createEstateSchema.safeParse({
    code: formData.get('code'),
    name: formData.get('name'),
  })

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  const { code, name } = validatedFields.data

  const estate: EstateInsert = {
    code: code.toUpperCase(),
    name,
  }

  const result = await tryCatch(ESTATES_REPOSITORY.create(estate))
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

export async function updateEstate(_prevState: unknown, formData: FormData): Promise<ActionState> {
  if (await getSession() === undefined) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.unauthorized]
      }
    }
  }
  const validatedFields = createEstateSchema.safeParse({
    code: formData.get('code'),
    name: formData.get('name'),
  })

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  const { code, name } = validatedFields.data

  const estate: EstateInsert = {
    code,
    name,
  }

  const result = await tryCatch(ESTATES_REPOSITORY.update(estate))
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

export async function deleteEstate(code: string): Promise<ActionState> {
  if (await getSession() === undefined) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.unauthorized]
      }
    }
  }
  const result = await tryCatch(ESTATES_REPOSITORY.remove(code))
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

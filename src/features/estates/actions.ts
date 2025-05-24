"use server"

import { type ActionState } from "@/lib/action-state"
import { type EstateInsert } from "@/server/db/schema"
import { getSession } from "@/lib/auth"
import { ERROR_MESSAGES_PT_BR, PublicError } from "@/lib/errors"
import { ESTATES_REPOSITORY } from "@/server/data_access/estates"
import { z } from "zod"
import { tryCatch } from "@/lib/try_catch"

export async function getEstates() {
  if (await getSession() !== undefined) {
    return ESTATES_REPOSITORY.findAll()
  }
  throw new PublicError(ERROR_MESSAGES_PT_BR.unauthorized)
}

const createEstateSchema = z.object({
  code: z.string().min(2).max(2),
  name: z.string().min(2).max(256)
})

export async function createEstate(_prevState: unknown, formData: FormData): Promise<ActionState> {
  const validatedFields = createEstateSchema.safeParse({
    code: formData.get('code'),
    name: formData.get('name'),
  })

  console.log(validatedFields)

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

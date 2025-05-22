"use server"

import { getSession } from "@/lib/auth"
import { ERROR_MESSAGES_PT_BR, PublicError } from "@/lib/errors"
import { ESTATES_REPOSITORY } from "@/server/data_access/estates"

// TODO: auth
export async function getEstates() {
  if (await getSession() !== undefined) {
    return ESTATES_REPOSITORY.findAll()
  }
  throw new PublicError(ERROR_MESSAGES_PT_BR.unauthorized)
}

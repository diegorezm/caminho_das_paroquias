"use server"

import type { ActionState } from "@/lib/action-state";
import { getSession } from "@/lib/auth";
import { ERROR_MESSAGES_PT_BR, PublicError } from "@/lib/errors";
import { tryCatch } from "@/lib/try_catch";
import { CITIES_REPOSITORY } from "@/server/data_access/cities";
import { ESTATES_REPOSITORY } from "@/server/data_access/estates";
import type { City, CityInsert } from "@/server/db/schema";
import { z } from "zod";

export async function findAllCities(): Promise<City[]> {
  if (await getSession() === undefined) {
    throw new PublicError(ERROR_MESSAGES_PT_BR.unauthorized)
  }

  const { data, error } = await tryCatch(CITIES_REPOSITORY.findAll())

  if (error) {
    console.error(error)
    throw new PublicError(ERROR_MESSAGES_PT_BR.unknown)
  }

  return data
}

const citySchema = z.object({
  name: z.string().min(2).max(256),
  estate: z.string().min(2).max(2)
})

function formatFormData(formData: FormData) {
  const validatedFields = citySchema.safeParse({
    name: formData.get("name"),
    estate: formData.get("estate")
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  return validatedFields.data
}


export async function createCity(_prev: unknown, formData: FormData): Promise<ActionState> {
  if (await getSession() === undefined) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.unauthorized]
      }
    }
  }
  const formattedData = formatFormData(formData)
  if ("errors" in formattedData) {
    return {
      status: "error",
      errors: formattedData.errors
    }
  }

  const { name, estate } = formattedData

  const { data, error } = await tryCatch(ESTATES_REPOSITORY.findByCode(estate))

  if (error) {
    return {
      status: "error",
      errors: {
        general: [error.message]
      }
    }
  }

  if (!data) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.notFound]
      }
    }
  }

  const city: CityInsert = {
    name,
    estateCode: estate
  }

  const result = await tryCatch(CITIES_REPOSITORY.create(city))

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


export async function updateCity(_prev: unknown, formData: FormData): Promise<ActionState> {
  if (await getSession() === undefined) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.unauthorized]
      }
    }
  }


  const cityIdFormDataValue = formData.get("cityId");

  let cityId: number | undefined;
  if (typeof cityIdFormDataValue === 'string' && cityIdFormDataValue.length > 0) {
    const parsedCityId = parseInt(cityIdFormDataValue, 10);
    if (!isNaN(parsedCityId) && parsedCityId > 0) {
      cityId = parsedCityId;
    }
  }

  if (!cityId) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.failedToUpdate]
      }
    }
  }

  const formattedData = formatFormData(formData)

  if ("errors" in formattedData) {
    return {
      status: "error",
      errors: formattedData.errors
    }
  }

  const { name, estate } = formattedData

  const { data, error } = await tryCatch(ESTATES_REPOSITORY.findByCode(estate))

  if (error) {
    return {
      status: "error",
      errors: {
        general: [error.message]
      }
    }
  }

  if (!data) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.notFound]
      }
    }
  }

  const city: CityInsert = {
    name,
    estateCode: estate
  }

  const result = await tryCatch(CITIES_REPOSITORY.update(cityId, city))

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

export async function deleteCity(id: number): Promise<ActionState> {
  if (await getSession() === undefined) {
    return {
      status: "error",
      errors: {
        general: [ERROR_MESSAGES_PT_BR.unauthorized]
      }
    }
  }

  const result = await tryCatch(CITIES_REPOSITORY.delete(id))

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

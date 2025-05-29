"use server"

import { SEARCH_REPOSITORY, type FindAllFilters } from "@/server/data_access/search";

export async function searchAction(filters: FindAllFilters) {
  return SEARCH_REPOSITORY.findAll(filters)
}

import { eq, ilike, or, type SQLWrapper } from "drizzle-orm"
import { db } from "../db"
import { addressTable, churchTable, cityTable, estatesTable } from "../db/schema"
import { paginateQuery, type PaginatedProps } from "../utils/drizzle-pagination"

export type FindAllFilters = PaginatedProps & {
  estate?: string
}

export const SEARCH_REPOSITORY = {
  async findAll({ limit = 10, q, page = 1, estate }: FindAllFilters) {
    const query = db.select().from(churchTable)
      .leftJoin(addressTable, eq(churchTable.addressId, addressTable.id))
      .leftJoin(cityTable, eq(cityTable.id, addressTable.cityId))
      .leftJoin(estatesTable, eq(estatesTable.code, cityTable.estateCode))

    const search: SQLWrapper[] = []

    if (estate) {
      search.push(eq(estatesTable.code, estate))
    }

    if (q) {
      search.push(ilike(churchTable.name, q))
      search.push(ilike(churchTable.email, q))
      search.push(ilike(cityTable.name, q))
      search.push(ilike(addressTable.neighborhood, q))
      search.push(ilike(addressTable.zipCode, q))
      search.push(ilike(addressTable.street, q))
    }

    if (search.length > 0) {
      query.where(or(...search))
    }

    const paginated = await paginateQuery(query.$dynamic(), { limit, page })
    return paginated
  }
}

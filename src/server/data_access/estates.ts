import { db } from "../db"
import { asc, eq, or, ilike, type SQLWrapper } from "drizzle-orm"

import { type EstateInsert, estatesTable } from "../db/schema"
import { paginateQuery, type PaginatedProps } from "../utils/drizzle-pagination"

export const ESTATES_REPOSITORY = {
  async findAll({ limit = 10, page = 1, q }: PaginatedProps) {
    const query = db.select().from(estatesTable).orderBy(asc(estatesTable.code))

    const search: SQLWrapper[] = []

    if (q) {
      search.push(ilike(estatesTable.name, q))
      search.push(ilike(estatesTable.code, q))
    }

    query.where(or(...search))

    const paginated = await paginateQuery(query.$dynamic(), { limit, page })
    return paginated

  },
  async findByCode(code: string) {
    const result = await db.select().from(estatesTable).where(eq(estatesTable.code, code))
    if (result.length === 0) {
      return undefined
    }
    return result[0]
  },
  async create(payload: EstateInsert) {
    await db.insert(estatesTable).values(payload)
  },
  async update(payload: EstateInsert) {
    await db.update(estatesTable).set(payload).where(eq(estatesTable.code, payload.code))
  },
  async remove(code: string) {
    await db.delete(estatesTable).where(eq(estatesTable.code, code))
  }
}

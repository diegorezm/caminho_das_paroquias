import { eq, ilike, or, asc, type SQLWrapper } from "drizzle-orm"
import { db } from "../db"
import { addressTable, type AddressInsert } from "../db/schema"
import { type PaginatedProps, paginateQuery } from "../utils/drizzle-pagination"

export const ADDRESS_REPOSITORY = {
  async findAll({ q, limit = 10, page = 1 }: PaginatedProps) {
    const query = db.select().from(addressTable).orderBy(asc(addressTable.id))
    const search: SQLWrapper[] = []

    if (q) {
      search.push(ilike(addressTable.neighborhood, q))
    }

    query.where(or(...search))

    const paginated = paginateQuery(query.$dynamic(), { limit, page })
    return paginated

  },
  async create(address: AddressInsert) {
    await db.insert(addressTable).values(address)
  },
  async update(id: number, address: AddressInsert) {
    await db.update(addressTable).set(address).where(eq(addressTable.id, id))
  },
  async delete(id: number) {
    await db.delete(addressTable).where(eq(addressTable.id, id))
  }
}

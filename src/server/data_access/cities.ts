import { db } from "../db"
import { eq, ilike } from "drizzle-orm"
import { type CityInsert, cityTable } from "../db/schema"
import { type PaginatedProps, paginateQuery } from "../utils/drizzle-pagination"

export const CITIES_REPOSITORY = {
  async findAll({ page = 1, limit = 10, q }: PaginatedProps) {
    const query = db.select().from(cityTable)

    if (q) {
      query.where(ilike(cityTable.name, q))
    }

    const paginated = await paginateQuery(query.$dynamic(), { page, limit })
    return paginated
  },
  async create(city: CityInsert) {
    await db.insert(cityTable).values(city)
  },
  async update(id: number, city: CityInsert) {
    await db.update(cityTable).set(city).where(eq(cityTable.id, id))
  },
  async delete(id: number) {
    await db.delete(cityTable).where(eq(cityTable.id, id))
  }
}

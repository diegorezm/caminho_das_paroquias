import { db } from "../db"
import { asc, eq, ilike, or, type SQLWrapper } from "drizzle-orm"
import { type ChurchInsert, churchTable } from "../db/schema"
import { type PaginatedProps, paginateQuery } from "../utils/drizzle-pagination"

export const CHURCH_REPOSITORY = {
  async findAll({ q, limit = 10, page = 1 }: PaginatedProps) {
    const query = db.select().from(churchTable).orderBy(asc(churchTable.id))
    const search: SQLWrapper[] = []

    if (q) {
      search.push(ilike(churchTable.name, q))
      search.push(ilike(churchTable.contactPerson, q))
    }

    query.where(or(...search))

    const paginated = await paginateQuery(query.$dynamic(), { limit, page })
    return paginated
  },

  async findById(id: number) {
    return await db.query.churchTable.findFirst({
      where: (churchTable, { eq }) => eq(churchTable.id, id),
    })
  },
  async create(values: ChurchInsert) {
    await db.insert(churchTable).values(values)
  },
  async update(id: number, values: ChurchInsert) {
    await db
      .update(churchTable)
      .set(values)
      .where(eq(churchTable.id, id))
  },
  async remove(id: number) {
    await db
      .delete(churchTable)
      .where(eq(churchTable.id, id))
  },
}

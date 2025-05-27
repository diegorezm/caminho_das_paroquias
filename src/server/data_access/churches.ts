import { db } from "../db"
import { eq } from "drizzle-orm"
import { type ChurchInsert, churchTable } from "../db/schema"

export const CHURCH_REPOSITORY = {
  async findAll() {
    return await db.query.churchTable.findMany()
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

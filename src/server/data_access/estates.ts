import { type EstateInsert, estatesTable } from "../db/schema"
import { db } from "../db"
import { eq } from "drizzle-orm"


export const ESTATES_REPOSITORY = {
  async findAll() {
    return db.query.estatesTable.findMany()
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

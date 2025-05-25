import { db } from "../db"
import { eq } from "drizzle-orm"

import { type EstateInsert, estatesTable } from "../db/schema"

export const ESTATES_REPOSITORY = {
  async findAll() {
    return db.query.estatesTable.findMany()
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

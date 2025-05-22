import { type EstateInsert, estatesTable } from "../db/schema"
import { db } from "../db"
import { eq } from "drizzle-orm"


export const ESTATES_REPOSITORY = {
  findAll() {
    return db.query.estatesTable.findMany()
  },
  create(payload: EstateInsert) {
    db.insert(estatesTable).values(payload)
  },
  update(payload: EstateInsert) {
    db.update(estatesTable).set(payload).where(eq(estatesTable.code, payload.code))
  },
  remove(code: string) {
    db.delete(estatesTable).where(eq(estatesTable.code, code))
  }
}

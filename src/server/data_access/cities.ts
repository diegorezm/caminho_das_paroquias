import { db } from "../db"
import { eq } from "drizzle-orm"
import { type CityInsert, cityTable } from "../db/schema"

export const CITIES_REPOSITORY = {
  async findAll() {
    return db.query.cityTable.findMany()
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

import { eq } from "drizzle-orm"
import { db } from "../db"
import { addressTable, type AddressInsert } from "../db/schema"

export const ADDRESS_REPOSITORY = {
  async findAll() {
    return await db.query.addressTable.findMany()
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

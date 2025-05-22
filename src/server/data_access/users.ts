import { eq } from "drizzle-orm"
import { db } from "../db"
import { type UserInsert, usersTable } from "../db/schema"

export const USERS_REPOSITORY = {
  async findById(id: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.id, id))
    if (result.length === 0) {
      return null
    }
    return result[0] ?? null
  },
  async findByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email))
    if (result.length === 0) {
      return null
    }
    return result[0] ?? null
  },

  async create(newUser: UserInsert) {
    db.insert(usersTable).values(newUser)
  }
}

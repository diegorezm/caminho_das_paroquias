import { eq, ilike } from "drizzle-orm"
import { db } from "../db"
import { type UserInsert, usersTable } from "../db/schema"
import { paginateQuery, type PaginatedProps } from "../utils/drizzle-pagination"

export const USERS_REPOSITORY = {
  async findAll({ page = 1, limit = 10, q }: PaginatedProps) {

    const query = db.select().from(usersTable)

    if (q) {
      query.where(ilike(usersTable.name, q))
      query.where(ilike(usersTable.email, q))
    }

    const paginated = await paginateQuery(query.$dynamic(), { page, limit })
    return paginated
  },
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
    await db.insert(usersTable).values(newUser)
  },
  async update(userId: string, updatedUser: UserInsert) {
    await db.update(usersTable).set({
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    }).where(eq(usersTable.id, userId))
  },
  async delete(userId: string) {
    await db.delete(usersTable).where(eq(usersTable.id, userId))
  },
}

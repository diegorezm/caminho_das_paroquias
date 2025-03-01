import { usersTable } from "@/server/db/schema";
import { type NewUser, type UserSafe } from "../models/user";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";

export const UserRepository = {
  async create(user: NewUser) {
    await db.insert(usersTable).values(user);
  },

  async update(id: string, user: Partial<Omit<UserSafe, "id">>) {
    await db
      .update(usersTable)
      .set({
        ...user,
        updatedAt: new Date(Date.now()),
      })
      .where(eq(usersTable.id, id));
  },

  async findById(id: string) {
    const [result] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!result) return null;
    return result;
  },

  async findByEmail(email: string) {
    const [result] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (!result) return null;
    return result;
  },

  async findByUsername(username: string) {
    const results = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.name, username));
    return results.length > 0 ? results : null;
  },
};

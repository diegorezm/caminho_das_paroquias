import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { sessionsTable } from "@/server/db/schema";

import type { Session } from "../models/session";

export const SessionsRepository = {
  async create(session: Session): Promise<void> {
    await db.insert(sessionsTable).values(session);
  },

  async findById(sessionId: string): Promise<Session | null> {
    // First item in the array
    const [result] = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.id, sessionId));

    if (!result) return null;

    return result;
  },

  async deleteById(sessionId: string): Promise<void> {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
  },

  async updateExpiration(
    sessionId: string,
    newExpiration: Date,
  ): Promise<void> {
    await db
      .update(sessionsTable)
      .set({ expiresAt: newExpiration })
      .where(eq(sessionsTable.id, sessionId));
  },
};

import { type sessionsTable } from "@/server/db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Session = InferSelectModel<typeof sessionsTable>;
export type NewSession = InferInsertModel<typeof sessionsTable>;

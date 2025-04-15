import { type churchTable } from "@/server/db/schema";

export type Church = typeof churchTable.$inferSelect;
export type NewChurch = typeof churchTable.$inferInsert;

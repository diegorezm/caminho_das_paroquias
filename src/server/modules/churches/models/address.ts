import type {
  cityTable,
  addressTable,
  estateTable,
} from "@/server/db/schema.ts";

export type Estate = typeof estateTable.$inferSelect;
export type NewEstate = typeof estateTable.$inferInsert;

export type City = typeof cityTable.$inferSelect;
export type NewCity = typeof cityTable.$inferInsert;

export type Address = typeof addressTable.$inferSelect;
export type NewAddress = typeof addressTable.$inferInsert;

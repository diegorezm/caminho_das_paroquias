import { type usersTable } from "@/server/db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof usersTable>;
export type NewUser = InferInsertModel<typeof usersTable>;

export type UserSafe = Omit<User, "password">;

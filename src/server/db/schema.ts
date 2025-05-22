import {
  index,
  integer,
  pgTableCreator,
  text,
  timestamp,
  char,
  uuid,
  varchar,
  foreignKey,
  pgEnum,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator(
  (name) => `caminho_das_paroquias_${name}`,
);

const timestamps = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
};

export const userRoles = pgEnum("user_roles", ["ADMIN", "USER"])

export const usersTable = createTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  password: text("password").notNull(),
  role: userRoles("role").default("USER").notNull(),
  ...timestamps,
});

export const sessionsTable = createTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
    userFk: foreignKey({
      columns: [table.userId],
      name: "sessions_user_fk",
      foreignColumns: [usersTable.id]
    }).onDelete("cascade"),
  }),
);

export const estatesTable = createTable("estates", {
  code: char("code", { length: 2 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull()
});

export const cityTable = createTable("cities", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 256 }).notNull(),
  stateCode: char("state_code", { length: 2 })
    .notNull()
    .references(() => estatesTable.code, { onDelete: "cascade" }),
});

export const addressTable = createTable("addresses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  zipCode: varchar("zip_code", { length: 9 }),
  street: varchar("street", { length: 256 }),
  neighborhood: varchar("neighborhood", { length: 256 }),
  houseNumber: varchar("house_number", { length: 6 }),
  cityId: integer("city_id")
    .notNull()
    .references(() => cityTable.id, { onDelete: "cascade" }),
});

export const churchTable = createTable(
  "churches",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),
    contactPerson: varchar("contact_person", { length: 256 }),
    email: varchar("email", { length: 256 }).unique(),
    phoneNumber: varchar("phone_number", { length: 15 }),
    addressId: integer("address_id")
      .notNull()
      .references(() => addressTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    addressIdx: index("churches_address_id_idx").on(table.addressId),
  }),
);

export type User = typeof usersTable.$inferSelect
export type UserInsert = typeof usersTable.$inferInsert
export type UserSafe = Omit<User, "password">

export type Session = typeof sessionsTable.$inferSelect

export type Estate = typeof estatesTable.$inferSelect
export type EstateInsert = typeof estatesTable.$inferInsert

export type City = typeof cityTable.$inferSelect
export type CityInsert = typeof cityTable.$inferInsert

export type Address = typeof addressTable.$inferSelect
export type AddressInsert = typeof addressTable.$inferInsert

export type Church = typeof churchTable.$inferSelect
export type ChurchInsert = typeof churchTable.$inferInsert

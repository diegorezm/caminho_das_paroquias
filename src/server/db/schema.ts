// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  text,
  timestamp,
  char,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `caminho_das_paroquias_${name}`,
);

const timestamps = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
};

export const usersTable = createTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  ...timestamps,
});

export const sessionsTable = createTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
  }),
);

export const estateTable = createTable("estado", {
  sigla: char("sigla", { length: 2 }).primaryKey(),
});

export const cityTable = createTable("cidade", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 200 }).notNull(),
  estado: char("estado", { length: 2 })
    .notNull()
    .references(() => estateTable.sigla, { onDelete: "cascade" }),
});

export const addressTable = createTable("endereco", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  cep: varchar("cep", { length: 9 }),
  rua: varchar("rua", { length: 200 }),
  bairro: varchar("bairro", { length: 200 }),
  numero: varchar("numero", { length: 6 }),
  cidadeId: integer("cidade_id")
    .notNull()
    .references(() => cityTable.id, { onDelete: "cascade" }),
});

export const churchTable = createTable(
  "igreja",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    nome: varchar("nome", { length: 250 }).notNull(),
    atendente: varchar("atendente", { length: 250 }),
    email: varchar("email", { length: 100 }).unique(),
    numeroContato: varchar("numero_contato", { length: 15 }),
    enderecoId: integer("endereco_id")
      .notNull()
      .references(() => addressTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    enderecoIdx: index("endereco_igreja_idx").on(table.enderecoId),
  }),
);

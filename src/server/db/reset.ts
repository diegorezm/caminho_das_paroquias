import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { db } from "./index.js";

import type * as schema from "./schema.js";

config();

async function resetDB(db: PostgresJsDatabase<typeof schema>) {
  const tablesSchema = db._.schema;
  if (!tablesSchema) throw new Error("Schema not loaded");
  const queries = Object.values(tablesSchema).map((table) => {
    console.log(`🧨 Preparing delete query for table: ${table.dbName}`);
    return sql.raw(`DELETE FROM ${table.dbName};`);
  });

  console.log("🛜 Sending delete queries");

  await db.transaction(async (trx) => {
    await Promise.all(
      queries.map(async (query) => {
        if (query) await trx.execute(query);
      }),
    );
  });

  console.log("✅ Database emptied");
}

resetDB(db)
  .then(() => {
    console.log("Completed!");
    process.exit();
  })
  .catch((e) => {
    console.log("ERROR: ", e);
  });

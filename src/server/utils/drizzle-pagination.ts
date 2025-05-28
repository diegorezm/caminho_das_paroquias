import { db } from "@/server/db";
import { sql } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";

export type PaginatedProps = {
  limit?: number;
  page?: number;
  q?: string;
}

interface PaginateParam {
  limit: number;
  page: number;
}
export async function paginateQuery<T extends PgSelect>(
  query: T,
  { limit, page }: PaginateParam,
) {
  const subQuery = query.as("sub");
  const rowCountQuery = db.select({ total: sql<number>`count(*)` }).from(
    subQuery,
  );

  const rowCountResult = await rowCountQuery.execute();
  const rowCount = Number(rowCountResult[0]?.total ?? 0);
  const pageCount = Math.ceil(rowCount / limit);

  query.limit(limit).offset((page - 1) * limit);

  const data = (await query.execute()) as Awaited<ReturnType<T["execute"]>>;

  return {
    data,
    pagination: {
      rowCount,
      pageCount,
      page,
      limit,
    },
  };
}

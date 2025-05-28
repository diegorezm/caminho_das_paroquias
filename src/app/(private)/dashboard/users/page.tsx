import type { PaginatedAction } from "@/types/paginated-action";

export default async function UsersPage({ searchParams }: { searchParams: Promise<PaginatedAction> }) {
  const { limit, page, q } = await searchParams;
  return <div>{limit}: {page} : {q}</div>
}

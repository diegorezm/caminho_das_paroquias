import { findAllUsers } from "@/features/users/actions";
import UsersDashboard from "@/features/users/components/UsersDashboard";
import { getQueryClient } from "@/lib/get-query-client";
import type { PaginatedAction } from "@/types/paginated-action";

export default async function UsersPage({ searchParams }: { searchParams: Promise<PaginatedAction> }) {
  const queryClient = getQueryClient()
  const { limit, page, q } = await searchParams;

  await queryClient.prefetchQuery({
    queryKey: ["users", { limit, page, q }],
    queryFn: async () => {
      return findAllUsers({ limit, q, page })
    }
  })

  return <UsersDashboard q={q} limit={limit} page={page} />
}

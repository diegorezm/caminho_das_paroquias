import { findAllEstates } from "@/features/estates/actions";
import { getQueryClient } from "@/lib/get-query-client";

import EstatesDashboard from "@/features/estates/components/EstatesDashboard";
import type { PaginatedAction } from "@/types/paginated-action";

export default async function EstatesDashboardPage({ searchParams }: { searchParams: Promise<PaginatedAction> }) {
  const { limit, page, q } = await searchParams
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["estates", { limit, page, q }],
    queryFn: async () => await findAllEstates({ limit, page, q })
  })

  return <EstatesDashboard />
}

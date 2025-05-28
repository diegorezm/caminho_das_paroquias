import { findAllChurches } from "@/features/churches/actions";
import ChurchDashboard from "@/features/churches/components/ChurchDashboard";
import { getQueryClient } from "@/lib/get-query-client";
import type { PaginatedAction } from "@/types/paginated-action";

export default async function ChurchPage({ searchParams }: { searchParams: Promise<PaginatedAction> }) {
  const { limit, page, q } = await searchParams;
  console.log({ limit, page, q })
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["churches", { limit, page, q }],
    queryFn: async () => await findAllChurches({ limit, page, q })
  })

  return <ChurchDashboard q={q} limit={limit} page={page} />
}

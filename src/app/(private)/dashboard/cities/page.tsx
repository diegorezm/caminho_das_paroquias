import { findAllCities } from "@/features/cities/actions"

import { getQueryClient } from "@/lib/get-query-client"

import type { PaginatedAction } from "@/types/paginated-action"

import CitiesDashboard from "@/features/cities/components/CitiesDashboard"

export default async function CitiesPage({ searchParams }: { searchParams: Promise<PaginatedAction> }) {
  const { limit, page, q } = await searchParams;
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["cities", { limit, page, q }],
    queryFn: async () => {
      return await findAllCities({ limit, page, q })
    }
  })

  return <CitiesDashboard limit={limit} page={page} q={q} />
}

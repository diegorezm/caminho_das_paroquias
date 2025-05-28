import { findAllAddresses } from "@/features/addresses/actions";
import { getQueryClient } from "@/lib/get-query-client";

import type { PaginatedAction } from "@/types/paginated-action"

import AddressesDashboard from "@/features/addresses/components/AdressesDashboard";

export default async function AddressPage({ searchParams }: { searchParams: Promise<PaginatedAction> }) {
  const { limit, page, q } = await searchParams;
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["addresses", { limit, page, q }],
    queryFn: async () => {
      return await findAllAddresses({ limit, page, q })
    }
  })
  return <AddressesDashboard />
}

import { findAllEstates } from "@/features/estates/actions";
import { getQueryClient } from "@/lib/get-query-client";

import EstatesDashboard from "@/features/estates/components/EstatesDashboard";

export default async function EstatesDashboardPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["estates"],
    queryFn: findAllEstates
  })

  return <EstatesDashboard />
}

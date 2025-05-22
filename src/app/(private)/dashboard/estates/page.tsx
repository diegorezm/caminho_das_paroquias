import { getQueryClient } from "@/lib/get-query-client";
import EstatesDashboard from "./estate";
import { getEstates } from "./actions";

export default async function EstatesDashboardPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["estates"],
    queryFn: getEstates
  })

  return <EstatesDashboard />
}

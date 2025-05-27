import { findAllChurches } from "@/features/churches/actions";
import ChurchDashboard from "@/features/churches/components/ChurchDashboard";
import { getQueryClient } from "@/lib/get-query-client";

export default async function ChurchPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["churches"],
    queryFn: findAllChurches
  })

  return <ChurchDashboard />
}

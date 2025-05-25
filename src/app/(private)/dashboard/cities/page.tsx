import { findAllCities } from "@/features/cities/actions"
import CitiesDashboard from "@/features/cities/components/CitiesDashboard"
import { getQueryClient } from "@/lib/get-query-client"

export default async function CitiesPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["cities"],
    queryFn: findAllCities
  })

  return <CitiesDashboard />
}

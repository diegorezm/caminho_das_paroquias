import { findAllAddresses } from "@/features/addresses/actions";
import AddressesDashboard from "@/features/addresses/components/AdressesDashboard";
import { getQueryClient } from "@/lib/get-query-client";

export default async function AdressPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["addresses"],
    queryFn: findAllAddresses
  })
  return <AddressesDashboard />
}

import styles from "./procurar.module.css";

import { Suspense } from "react";

import SearchBar from "./_components/SearchBar";
import Loader from "@/components/Loader";
import { getQueryClient } from "@/lib/get-query-client";
import { searchAction } from "./_components/SearchBar/actions";
import { QueryProvider } from "@/providers/query-provider";
import ChurchList from "./_components/ChurchList"
import type { FindAllFilters } from "@/server/data_access/search";

export default async function ProcurarPage({ searchParams }: { searchParams: Promise<FindAllFilters> }) {
  const queryClient = getQueryClient()
  const { limit, q, page, estate } = await searchParams

  await queryClient.prefetchQuery({
    queryKey: ["search", { limit, q, page }],
    queryFn: async () => await searchAction({ limit, q, page, estate })
  })

  return (
    <QueryProvider>
      <div className={styles.container}>
        <Suspense fallback={<Loader />}>
          <SearchBar
          />
          <ChurchList limit={limit} q={q} page={page} estate={estate} />
        </Suspense>
      </div>
    </QueryProvider>
  );
}

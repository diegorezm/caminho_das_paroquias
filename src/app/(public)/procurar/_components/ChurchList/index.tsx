"use client"

import styles from "./church.list.module.css"

import { searchAction } from "../SearchBar/actions";
import Loader from "@/components/Loader";
import Alert from "@/components/ui/Alert";
import { useQuery } from "@tanstack/react-query";
import type { FindAllFilters } from "@/server/data_access/search";
import Pagination from "@/components/Pagination";

export default function ChurchList({ limit, q, page, estate }: FindAllFilters) {
  const { data, error, isError, isPending } = useQuery({
    queryKey: ["search", { limit, q, page, estate }],
    queryFn: async () => await searchAction({ limit, q, page, estate }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })

  if (isPending) {
    return <Loader />
  }

  if (isError) {
    return <Alert variant="error" message={error.message} />
  }

  if (!data || data.data.length === 0) {
    return (
      <Alert variant="info" message="Não há resultados para a sua pesquisa." />
    );
  }

  const { pagination } = data;

  return (
    <div className={styles.resultsContainer}>
      <h2 className={styles.resultsHeader}>
        Resultados da Pesquisa ({pagination.rowCount} total)
      </h2>

      <ul className={styles.resultsList}>
        {data.data.map((item) => (
          <li key={item.churches.id} className={styles.resultItem}>
            <div className={styles.churchInfo}>
              <h3>{item.churches.name}</h3>
              <p>{item.churches.phoneNumber}</p>
            </div>

            {item.addresses && (
              <div className={styles.addressInfo}>
                <h4>Endereço:</h4>
                <p>
                  {item.addresses.street}, {item.addresses.houseNumber}{" "}
                  {item.addresses.neighborhood && `(${item.addresses.neighborhood})`}
                </p>
                {item.addresses.zipCode && <p>CEP: {item.addresses.zipCode}</p>}
              </div>
            )}

            {item.cities && (
              <div className={styles.cityInfo}>
                <h4>Cidade:</h4>
                <p>
                  {item.cities.name} ({item.cities.estateCode})
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>

      {pagination.pageCount > 1 && (
        <div className={styles.paginationControls}>
          <Pagination
            totalPages={pagination.pageCount}
            isLoading={isPending}
          />
        </div>
      )}
    </div>
  )
}

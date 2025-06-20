"use client";

import styles from "./searchbar.module.css";
import Input from "@/components/ui/Input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { findAllEstates } from "@/features/estates/actions";
import Select, { type SelectOption } from "@/components/ui/Select";
import { useCallback, useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q")?.toString() ?? "");
  const [selectedEstate, setSelectedEstate] = useState(searchParams.get("estate")?.toString() ?? "SP");

  const {
    data: estates,
    error: estatesError,
    isError: isEstatesError,
    isPending: isEstatesPending,
  } = useQuery({
    queryFn: async () => {
      return await findAllEstates({ limit: 20 });
    },
    queryKey: ["estates"],
  });

  const estateOptions: SelectOption[] = (estates?.data ?? []).map((estate) => ({
    value: estate.code,
    label: estate.name,
  }));

  const handleSearchParams = useCallback((k: string, v: string) => {
    const params = new URLSearchParams(searchParams);
    if (v) {
      params.set(k, v);
    } else {
      params.delete(k);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams])

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearchParams("q", searchTerm);
    }, 250);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, handleSearchParams])

  return (
    <div className={styles.container}>
      <div className={styles["input-container"]}>
        <Input
          placeholder="Procurar por cidade, nome..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <div>
          {isEstatesPending ? (
            <Input type="text" placeholder="Carregando estados..." disabled />
          ) : isEstatesError ? (
            <Input type="text" placeholder={`Erro ao carregar estados: ${estatesError?.message}`} disabled />
          ) : (
            <Select
              name="estate"
              options={estateOptions}
              placeholder="Selecione o Estado"
              sizing="md"
              id="estateSelect"
              onChange={(e) => {
                setSelectedEstate(e.target.value)
                handleSearchParams("estate", e.target.value)
              }}
              value={selectedEstate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

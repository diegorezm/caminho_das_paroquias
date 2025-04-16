"use client";
import Input from "@/components/ui/Input";
import styles from "./searchbar.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type Props = {
  filter: {
    estates: string[];
  };
};

export default function SearchBar({ filter }: Props) {
  const { estates } = filter;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSearchParams(k: string, v: string) {
    const params = new URLSearchParams(searchParams);
    if (v) {
      params.set(k, v);
    } else {
      params.delete(k);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles["input-container"]}>
        <Input
          placeholder="Procurar por cidade, nome..."
          defaultValue={searchParams.get("search")?.toString() ?? ""}
          onChange={(e) => {
            handleSearchParams("search", e.target.value);
          }}
        />
        <select
          name="filter-state-select"
          id="filter-state-select"
          className={styles["state-select"]}
          defaultValue={searchParams.get("estate")?.toString() ?? "SP"}
          onChange={(e) => {
            handleSearchParams("estate", e.target.value);
          }}
        >
          {estates.map((e, i) => (
            <option value={e} key={i + 1} className={styles["state-option"]}>
              {e}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

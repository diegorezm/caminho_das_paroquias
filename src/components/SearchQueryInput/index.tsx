"use client"

import { useRouter } from "next/navigation";
import Input from "../ui/Input"
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";


export default function SearchParamsInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q")?.toString() ?? "");

  const handleSearchParams = useCallback((k: string, v: string) => {
    const params = new URLSearchParams(searchParams);
    if (v) {
      params.set(k, v);
    } else {
      params.delete(k);
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams])

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearchParams("q", searchTerm);
    }, 250);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, handleSearchParams])

  return <Input
    placeholder="Procurar..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

}

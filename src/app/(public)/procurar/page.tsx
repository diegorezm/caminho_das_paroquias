import styles from "./procurar.module.css";

import { Suspense } from "react";

import SearchBar from "./_components/SearchBar";
import Loader from "@/components/Loader";

export default function ProcurarPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<Loader />}>
        <SearchBar
          filter={{
            estates: ["SP", "MG", "RJ"],
          }}
        />
      </Suspense>
    </div>
  );
}

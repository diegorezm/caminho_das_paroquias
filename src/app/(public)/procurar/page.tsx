import styles from "./procurar.module.css";
import SearchBar from "./_components/SearchBar";

export default function ProcurarPage() {
  return (
    <div className={styles.container}>
      <SearchBar
        filter={{
          estates: ["SP", "MG", "RJ"],
        }}
      />
    </div>
  );
}

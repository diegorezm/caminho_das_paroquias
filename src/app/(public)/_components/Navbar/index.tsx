import Link from "next/link";
import styles from "./navbar.module.css";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <div>
        <Link href="/">
          <Image src="logo.svg" height={60} width={120} alt="App logo" />
        </Link>
      </div>

      <div className={styles.auth_links}>
        <Link href="/procurar">
          <Button size="sm" variant="primary">
            Procurar
          </Button>
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import styles from "./navbar.module.css";
import Button from "@/components/ui/Button";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <div>
        <Link href="/">Principal</Link>
      </div>

      <div className={styles.auth_links}>
        <Link href="/sign-up">
          <Button size="sm" variant="outline">
            Crie sua conta!
          </Button>
        </Link>
        <Link href="/sign-in">
          <Button size="sm">Entrar</Button>
        </Link>
      </div>
    </div>
  );
}

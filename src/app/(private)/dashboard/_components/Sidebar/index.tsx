import styles from "./sidebar.module.css";
import Navigation from "../Navigation";
import type { UserSafe } from "@/server/db/schema";

export default function Sidebar({ user }: { user?: UserSafe }) {
  return (
    <aside className={styles.sidebar}>
      <Navigation user={user} />
    </aside>
  );
}


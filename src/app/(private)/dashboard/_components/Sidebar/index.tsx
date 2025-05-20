import styles from "./sidebar.module.css";
import Navigation from "../Navigation";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Navigation />
    </aside>
  );
}


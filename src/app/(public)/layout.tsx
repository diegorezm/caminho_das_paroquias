import Navbar from "./_components/Navbar";
import styles from "./layout.module.css";

type Props = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: Props) {
  return (
    <div>
      <Navbar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}

import Navbar from "./_components/Navbar";
import styles from "./layout.module.css";
import { getSession } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

export default async function PublicLayout({ children }: Props) {
  const session = await getSession()

  return (
    <div>
      <Navbar user={session?.user} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}

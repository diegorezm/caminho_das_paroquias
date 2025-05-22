import { QueryProvider } from "@/providers/query-provider";
import MobileNavigation from "./_components/MobileNavigation";
import Sidebar from "./_components/Sidebar";
import styles from "./dashboard.module.css"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <div className={styles.mobileNav}>
        <MobileNavigation />
      </div>
      <div className={styles.desktopNav}>
        <Sidebar />
      </div>
      <main className={styles.main}>
        {children}
      </main>
    </QueryProvider>
  )
}

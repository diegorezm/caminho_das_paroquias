import { QueryProvider } from "@/providers/query-provider";
import MobileNavigation from "./_components/MobileNavigation";
import Sidebar from "./_components/Sidebar";
import styles from "./dashboard.module.css"
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (session == undefined) {
    return redirect("/login")
  }

  return (
    <QueryProvider>
      <div className={styles.mobileNav}>
        <MobileNavigation user={session.user} />
      </div>
      <div className={styles.desktopNav}>
        <Sidebar user={session.user} />
      </div>
      <main className={styles.main}>
        {children}
      </main>
    </QueryProvider>
  )
}

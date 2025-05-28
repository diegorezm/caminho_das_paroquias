import styles from "./dashboard.module.css"

import { QueryProvider } from "@/providers/query-provider";
import MobileNavigation from "./_components/MobileNavigation";
import Sidebar from "./_components/Sidebar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserMenu from "@/components/UserMenu";

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
      <div className={styles.userNav}>
        <UserMenu userName={session.user.name} />
      </div>
      <main className={styles.main}>
        {children}
      </main>
    </QueryProvider>
  )
}

import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (session == undefined) {
    return redirect("/login")
  }
  return children
}

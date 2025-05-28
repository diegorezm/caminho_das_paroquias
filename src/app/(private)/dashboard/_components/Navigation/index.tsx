"use client";

import { Building2, Church, MapPinHouse, Map, Users } from "lucide-react";

import styles from "./navigation.module.css"
import { usePathname } from "next/navigation";
import Link from "next/link";

type Route = {
  label: string;
  href: string;
  Icon: JSX.Element
}

const ROUTES: Route[] = [
  {
    label: "Igrejas",
    href: "/dashboard/churches",
    Icon: <Church className={styles.icon} />
  },
  {
    label: "Endereços",
    href: "/dashboard/addresses",
    Icon: <MapPinHouse className={styles.icon} />
  },
  {
    label: "Cidades",
    href: "/dashboard/cities",
    Icon: <Building2 className={styles.icon} />
  },
  {
    label: "Estados",
    href: "/dashboard/estates",
    Icon: <Map className={styles.icon} />
  },
]

const ADMIN_ROUTES: Route[] = [
  {
    label: "Usuários",
    href: "/dashboard/users",
    Icon: <Users className={styles.icon} />
  }
]


export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className={styles.list}>
        {ROUTES.map((route) => {
          const isActive = pathname.startsWith(route.href);

          return (
            <li
              key={route.href}
              className={styles.listItem}
            >
              <Link href={route.href} className={`${styles.link} ${isActive ? styles.active : ""}`}>
                {route.Icon}
                {route.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

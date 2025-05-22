"use client";

import { Building2, Church, MapPinHouse, Map } from "lucide-react";

import styles from "./navigation.module.css"
import { usePathname } from "next/navigation";
import Link from "next/link";

const ROUTES = [
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


export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className={styles.list}>
        {ROUTES.map((route) => {
          const isActive = pathname === route.href;

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

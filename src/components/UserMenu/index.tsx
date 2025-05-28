"use client";

import styles from "./user.menu.module.css"
import React from 'react';
import Link from 'next/link';
import { User, LayoutDashboard, Search, LogOut, Home } from 'lucide-react'; // Import Lucide icons
import { logoutAction } from '@/app/actions';
import Dropdown from '../ui/Dropdown';
import Button from '../ui/Button';

interface UserMenuProps {
  userName?: string;
}

export default function UserMenu({ userName = "Usuário" }: UserMenuProps) {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <Dropdown
      trigger={
        <Button variant="primary" size="sm">
          <User size={18} />
          {userName}
        </Button>
      }
    >


      <Link href="/" passHref legacyBehavior>
        <a className={styles.menuItem} role="menuitem">
          <Home size={18} />
          Página inicial
        </a>
      </Link>
      <Link href="/dashboard" passHref legacyBehavior>
        <a className={styles.menuItem} role="menuitem">
          <LayoutDashboard size={18} />
          Dashboard
        </a>
      </Link>

      <Link href="/procurar" passHref legacyBehavior>
        <a className={styles.menuItem} role="menuitem">
          <Search size={18} />
          Procurar
        </a>
      </Link>


      <button
        onClick={handleLogout}
        className={styles.menuItem}
        role="menuitem"
      >
        <LogOut size={18} />
        Sair
      </button>
    </Dropdown>
  );
}

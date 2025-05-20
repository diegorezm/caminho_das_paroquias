"use client"
import Button from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import { Menu } from "lucide-react";
import Navigation from "../Navigation";
import { useState } from "react";
import styles from "./mobilenav.module.css"

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={styles.container}>
      <Sheet trigger={<Button size="sm" variant="outline"><Menu /></Button>} isOpen={isOpen} onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)} side="left">
        <Navigation />
      </Sheet>
    </div>
  )
}

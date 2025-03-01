"use client";

import styles from "./alert.module.css";

import { useState } from "react";
import { CircleX, Info } from "lucide-react";

type Props = {
  variant?: "error" | "info";
  message: string;
};

export default function Alert({ variant = "info", message }: Props) {
  const [show, setShow] = useState(true);
  if (!show) return null;

  const Icon = variant === "info" ? Info : CircleX;
  const alertClass = `${styles.alert} ${styles[`alert-${variant}`]}`;
  return (
    <div className={alertClass}>
      <Icon onClick={() => setShow(false)} className={styles.x_icon} />
      <p>{message}</p>
    </div>
  );
}

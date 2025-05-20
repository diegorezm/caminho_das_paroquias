import { type ReactNode } from "react";
import styles from "./sheet.module.css";

type Props = {
  children: ReactNode;
  isOpen: boolean
  onOpen: VoidFunction
  onClose: VoidFunction;
  trigger?: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
};

export default function Sheet({ children, side = "right", onOpen, isOpen = false, onClose, trigger }: Props) {
  return (
    <>
      {trigger !== undefined &&
        <div onClick={onOpen}>{trigger}</div>}

      {isOpen && (
        <>
          <div className={styles.overlay} onClick={onClose} />
          <div className={`${styles.sheet} ${styles[side]}`}>
            <button className={styles.close} onClick={onClose}>
              &times;
            </button>
            <div className={styles.content}>{children}</div>
          </div>
        </>
      )}
    </>
  );
}


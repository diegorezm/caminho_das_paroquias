import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import style from "./dialog.module.css";
import Button from "../Button";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: "sm" | "md" | "lg";
};

export default function Dialog({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = "md",
  ...props
}: Props) {
  if (!isOpen) {
    return null;
  }

  const dialogContentClass = `${style.dialogContent} ${style[`dialog-${size}`]} ${isOpen ? style.open : ''}`;

  return (
    <div className={`${style.dialogOverlay} ${isOpen ? style.open : ''}`} onClick={onClose}>
      <div
        className={dialogContentClass}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <div className={style.dialogHeader}>
          {title && <h2 className={style.dialogTitle}>{title}</h2>}
          <button className={style.dialogCloseButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={style.dialogBody}>{children}</div>
        {actions && <div className={style.dialogActions}>{actions}</div>}
      </div>
    </div>
  );
}

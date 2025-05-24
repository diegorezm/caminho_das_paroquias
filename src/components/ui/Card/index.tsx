import { type ReactNode } from "react";
import style from "./card.module.css";

type CardProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  children?: ReactNode;
};

export function CardRoot({ variant = "primary", children, className }: CardProps) {
  const cardClass = `${style.card} ${style[`card-${variant}`]} ${className}`;
  return <div className={cardClass}>{children}</div>;
}

type CardHeaderProps = {
  title: string;
  description?: string;
};

export function CardHeader({ title, description }: CardHeaderProps) {
  return (
    <div className={style.cardTitle}>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}

type CardBodyProps = {
  children?: ReactNode;
};

export function CardBody({ children }: CardBodyProps) {
  return <div className={style.cardBody}>{children}</div>;
}

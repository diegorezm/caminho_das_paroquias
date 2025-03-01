import { type ReactNode } from "react";
import style from "./card.module.css";

type CardProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  children?: ReactNode;
};

export function CardRoot({ variant = "primary", children }: CardProps) {
  const cardClass = `${style.card} ${style[`card-${variant}`]}`;
  return <div className={cardClass}>{children}</div>;
}

type CardTitleProps = {
  title: string;
  description?: string;
};

export function CardTitle({ title, description }: CardTitleProps) {
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

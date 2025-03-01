import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import style from "./button.module.css";

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  ...props
}: Props) {
  const buttonClass = `${style.button} ${style[`button-${variant}`]} ${style[`button-${size}`]}`;
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}

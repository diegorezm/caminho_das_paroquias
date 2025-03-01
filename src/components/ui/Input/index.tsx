import type { InputHTMLAttributes, DetailedHTMLProps } from "react";
import style from "./input.module.css";

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  size?: "sm" | "md" | "lg";
};

export default function Input({ size = "md", ...props }: Props) {
  const inputClass = `${style.input} ${style[`input-${size}`]}`;
  return <input className={inputClass} {...props} />;
}

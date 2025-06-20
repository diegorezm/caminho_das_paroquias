import type { InputHTMLAttributes, DetailedHTMLProps } from "react";
import style from "./input.module.css";

export type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  variant?: "default" | "on-primary" | "on-secondary";
  inputSize?: "sm" | "md" | "lg";
};

export default function Input({
  variant = "default",
  inputSize = "md",
  ...props
}: Props) {
  const inputClass = `${style.input} ${style[`input-${inputSize}`]} ${style[`input-${variant}`]}`;
  return <input className={inputClass} {...props} />;
}

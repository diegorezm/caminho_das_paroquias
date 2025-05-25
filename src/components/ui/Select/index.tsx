import type { SelectHTMLAttributes, DetailedHTMLProps } from "react";
import style from "./select.module.css";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean; // Optional: to disable specific options
};

type Props = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  options: SelectOption[];
  placeholder?: string;
  sizing?: "sm" | "md" | "lg";
};

export default function Select({
  options,
  placeholder,
  sizing = "md",
  className,
  ...props
}: Props) {
  const selectClass = `${style.select} ${style[`select-${sizing}`]} ${className ?? ""}`;

  return (
    <div className={style.selectContainer}>
      <select className={selectClass} {...props}>
        {placeholder && (
          <option value="" disabled selected={!props.value}>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

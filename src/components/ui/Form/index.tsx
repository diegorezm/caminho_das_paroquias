import styles from "./form.module.css";

import {
  type DetailedHTMLProps,
  type FormHTMLAttributes,
  type ReactNode,
} from "react";
import { type FieldError } from "react-hook-form";

type FormFieldProps = {
  label?: string;
  error?: FieldError;
  children: ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      {children}
      {error && <p className={styles.error}>{error.message}</p>}
    </div>
  );
}

type FormProps = DetailedHTMLProps<
  FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  children?: ReactNode;
};

export function Form({ children, ...props }: FormProps) {
  return (
    <form className={styles.form} {...props}>
      {children}
    </form>
  );
}

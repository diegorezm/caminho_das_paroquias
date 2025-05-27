import styles from "./form.module.css";

import {
  type DetailedHTMLProps,
  type FormHTMLAttributes,
  type ReactNode,
} from "react";


type Props = {
  state: { status: "error"; errors: { general?: string[] } } | null;
};

export function FormError({ state }: Props) {
  if (state?.status !== "error" || !state.errors.general?.length) return null;
  return <p className={styles.error}>{state.errors.general.join("\n")}</p>;
}

type FormFieldProps = {
  label?: string;
  htmlFor?: string;
  error?: string | string[];
  children: ReactNode;
};

export function FormField({ label, error, children, htmlFor }: FormFieldProps) {
  const err = Array.isArray(error) ? error.join("\n") : error
  return (
    <div className={styles.field}>
      {label && <label className={styles.label} htmlFor={htmlFor}>{label}</label>}
      {children}
      {error && <p className={styles.error}>{err}</p>}
    </div>
  );
}

type FormActionsProps = {
  children?: ReactNode;
  className?: string
}
export function FormActions({ children, className }: FormActionsProps) {
  const classes = `${styles.actions} ${className}`
  return (
    <div className={classes}>
      {children}
    </div>
  )
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

import { SignUpForm } from "./form";
import styles from "./sign_up.module.css";

import { CardBody, CardRoot, CardTitle } from "@/components/ui/Card";

export default function SignUpPage() {
  return (
    <div className={styles.page}>
      <CardRoot variant="secondary">
        <CardTitle
          title="Crie sua conta!"
          description="Insira suas informações e crie sua conta!"
        />
        <CardBody>
          <SignUpForm />
        </CardBody>
      </CardRoot>
    </div>
  );
}

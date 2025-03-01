import styles from "./sign_in.module.css";

import { CardBody, CardRoot, CardTitle } from "@/components/ui/Card";

import { SignInForm } from "./form";

export default function SignInPage() {
  return (
    <div className={styles.page}>
      <CardRoot variant="primary">
        <CardTitle
          title="Entre em sua conta!"
          description="Insira suas informações e entra em sua conta!"
        />
        <CardBody>
          <SignInForm />
        </CardBody>
      </CardRoot>
    </div>
  );
}

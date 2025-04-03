import styles from "./sign_in.module.css";

import { CardBody, CardRoot, CardTitle } from "@/components/ui/Card";

import { SignInForm } from "./form";

export default function SignInPage() {
  return (
    <div className={styles.page}>
      <CardRoot variant="secondary">
        <CardTitle title="Entre em sua conta!" />
        <CardBody>
          <SignInForm />
        </CardBody>
      </CardRoot>
    </div>
  );
}

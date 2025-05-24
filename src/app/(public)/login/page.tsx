import { CardBody, CardHeader, CardRoot } from "@/components/ui/Card";
import LoginForm from "./_components/LoginForm";
import styles from "./login.module.css"

export default function LoginPage() {
  return (
    <CardRoot variant="ghost" className={styles.container}>
      <CardHeader title="Login" />
      <CardBody>
        <LoginForm />
      </CardBody>
    </CardRoot>
  )
}

import { LoaderIcon } from "lucide-react"
import styles from "./loader.module.css"

export default function Loader() {
  return <div className={styles.loader}>
    <LoaderIcon />
  </div>
}

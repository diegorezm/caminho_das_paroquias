import styles from "./loader.module.css"

export default function Loader() {
  return (
    <div className={styles["loading-wave"]}>
      <div className={styles["loading-bar"]}></div>
      <div className={styles["loading-bar"]}></div>
      <div className={styles["loading-bar"]}></div>
      <div className={styles["loading-bar"]}></div>
    </div>
  )
}

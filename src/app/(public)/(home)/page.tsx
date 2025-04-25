import Button from "@/components/ui/Button";
import styles from "./index.module.css";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <div className={styles.container}>
      <div className={styles["content-wrapper"]}>
        <h1 className={styles["page-title"]}>Caminho das paróquias!</h1>
        <p className={styles["page-description"]}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio iste
          molestias nobis iure neque. Id eos molestiae, explicabo quae ullam
          inventore magnam autem sequi alias soluta nulla officia? Consectetur,
          itaque.
        </p>
        <Link className={styles["button-container"]} href="/procurar">
          <Button>Encontre uma paróquia!</Button>
        </Link>
      </div>
      <div className={styles["image-wrapper"]}>
        <Image
          src="/undraw_right-direction.svg"
          height={400}
          width={400}
          alt="Homem olhando para uma placa."
        />
      </div>
    </div>
  );
}

import styles from "./index.module.css";

import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles["content-wrapper"]}>
        <h1 className={styles["page-title"]}>Caminho das paróquias!</h1>
        <p className={styles["page-description"]}>
          Econtre as paróquias mais próximas de você! Pesquise por nome,
          endereço ou CEP e veja informações detalhadas.
          Descubra horários de missa, contatos e muito mais!
        </p>
        <Link className={styles["button-container"]} href="/procurar">
          <Button size="lg">Encontre uma paróquia!</Button>
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
